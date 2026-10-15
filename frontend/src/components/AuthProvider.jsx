import { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/axios";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const BASE_URL = axiosInstance.defaults.baseURL || "http://localhost:5000/api";
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [authInitialized, setAuthInitialized] = useState(false);
  const isAuthenticated = !!token;
  const tokenRef = useRef(token);
  // Sync the ref with the latest token state safely after commit/render
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Intitializer to prevent startup race (concurrent refresh)
      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/token`,
          {},
          {
            withCredentials: true,
          },
        );
        setToken(data.accessToken);
        tokenRef.current = data.accessToken;
      } catch {
        setToken(null);
      } finally {
        setAuthInitialized(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const authInterceptor = axiosInstance.interceptors.request.use((config) => {
      if (tokenRef.current && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      return config;
    });
    return () => {
      // useEffect cleanup function
      axiosInstance.interceptors.request.eject(authInterceptor); // delete the old interceptor when unmount so that we don't have multiple interceptors running at the same time in new mount
    };
  }, []);

  useEffect(() => {
    let refreshPromise = null; //(Mutex) to prevent multiple refresh requests from being sent simultaneously when multiple requests fail with 403 at the same time. This ensures that only one refresh request is sent, and other requests wait for its result.

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // if condition to prevent infinite loop of retrying the refresh request
        if (error.response?.status === 403 && !originalRequest._retry) {
          if (!refreshPromise) {
            refreshPromise = axios
              .post(
                `${BASE_URL}/auth/token`,
                {},
                {
                  withCredentials: true,
                },
              )
              .finally(() => {
                refreshPromise = null; // Reset the refreshPromise after the request is completed (either success or failure)
              });
          }
          try {
            const { data } = await refreshPromise;
            setToken(data.accessToken);
            tokenRef.current = data.accessToken;
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            originalRequest._retry = true;
            return axiosInstance(originalRequest);
          } catch {
            // No token in response data, meaning refresh token is invalid or expired
            setToken(null);
          }
          return Promise.reject(error); //reject the error if we can't refresh the token (pass the error to original request's (fetchMe) catch block)
        }
        return Promise.reject(error); //In case of errors other than 403
      },
    );
    return () => axiosInstance.interceptors.response.eject(responseInterceptor);
  }, []);

  useEffect(() => {
    if (!authInitialized || !token) return;
    const fetchMe = async () => {
      try {
        const response = await axiosInstance.get(`/user/profile`);
        setProfile(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (e) {
        setToken(null);
        tokenRef.current = null;
        setIsLoading(false);
        console.log(e);
      }
    };
    fetchMe();
  }, [isAuthenticated, authInitialized]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
        authInitialized,
        profile,
        setProfile,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
