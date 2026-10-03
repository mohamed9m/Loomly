import { useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import ProductsData from "../context/ProductsData";
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [authInitialized, setAuthInitialized] = useState(false);
  const isAuthenticated = !!token;
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { dispatch } = useContext(ProductsData);

  useEffect(() => {
    const initializeAuth = async () => {
      // Intitializer to prevent startup race (concurrent refresh)
      try {
        const { data } = await axiosInstance.post("/auth/token");
        setToken(data.accessToken);
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
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });
    return () => {
      // useEffect cleanup function
      axiosInstance.interceptors.request.eject(authInterceptor); // delete the old interceptor when unmount so that we don't have multiple interceptors running at the same time in new mount
    };
  }, [token]);

  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // if condition to prevent infinite loop of retrying the refresh request
        if (error.response?.status === 403 && !originalRequest._retry) {
          try {
            const response = await axiosInstance.post("/auth/token");
            setToken(response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
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
        const response = await axiosInstance.get("/user/profile");
        setProfile(response.data);
        console.log(response.data);
        setIsLoading(false);
      } catch (e) {
        setToken(null);
        setIsLoading(false);
        console.log(e);
      }
    };
    fetchMe();
  }, [isAuthenticated, authInitialized]);
  useEffect(() => {
    if (!authInitialized || !token) return;
    const fetchCart = async () => {
      try {
        const { data } = await axiosInstance.get("/cart");
        const products = data.cart.products.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        console.log(products);
        dispatch({ type: "SET_CART", payload: products });
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
        console.log(e);
      }
    };
    fetchCart();
  }, [isAuthenticated, authInitialized]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
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
