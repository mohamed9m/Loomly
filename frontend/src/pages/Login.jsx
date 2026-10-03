import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
export default function Login() {
  const { setToken, setIsLoading, isAuthenticated } = useAuth();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }
  const validate = () => {
    const nextErrors = {};

    if (!emailRegex.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (form.password.trim().length === 0) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);

    if (nextErrors.email) {
      emailRef.current?.focus();
    } else if (nextErrors.password) {
      passwordRef.current?.focus();
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;
    try {
      setServerError("");
      const response = await axiosInstance.post(
        "/auth/login",
        { email: form.email, password: form.password },
        {
          withCredentials: true,
        },
      );
      console.log(response.data);
      const token = response.data.accessToken;
      setToken(token);
      setIsLoading(false);
      navigate("/products", { state: { loggedIn: true } });
    } catch (err) {
      setIsLoading(false);
      if (err.response?.status === 400)
        setServerError("Please check the submitted data.");
      else if (err.response?.status === 401)
        setServerError("Wrong email or password!");
      else if (err.response?.status === 429) {
        setServerError("Too many login attempts. Please try again later.");
      } else setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div className="container min-vh-100 d-flex flex-column py-4">
        <div className="text-center mt-3 mb-4 mb-lg-0">
          <Link to="/" aria-label="Go to home">
            <svg
              width="300"
              height="60"
              viewBox="0 0 260 64"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="loomGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stop-color="#A3B37E" />
                  <stop offset="100%" stop-color="#91b44a" />
                </linearGradient>
              </defs>

              <g>
                <rect
                  x="0"
                  y="0"
                  width="64"
                  height="64"
                  rx="16"
                  fill="url(#loomGrad)"
                />

                <path
                  d="M18 14 V46 H48"
                  stroke="#ffffff"
                  stroke-width="6.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />

                <path
                  d="M18 23 H29"
                  stroke="#ffffff"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  opacity="0.55"
                />
                <path
                  d="M18 32 H29"
                  stroke="#ffffff"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  opacity="0.55"
                />
                <path
                  d="M18 41 H36"
                  stroke="#ffffff"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  opacity="0.55"
                />

                <circle cx="48" cy="46" r="4" fill="#ffffff" />
              </g>

              <text
                x="80"
                y="41"
                font-family="Georgia, 'Times New Roman', serif"
                font-size="40"
                font-weight="600"
                letter-spacing="0.5"
                fill="#20241a"
              >
                Loomly
              </text>
            </svg>{" "}
          </Link>
        </div>
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div
            className="card register-form w-100 shadow-sm"
            style={{ maxWidth: "500px" }}
          >
            <div className="card-body p-4">
              <h2
                className="text-center mb-5 mt-2 btn-dark fw-semibold"
                style={{ padding: "10px 0", borderRadius: "5px" }}
              >
                Sign In
              </h2>
              {location.state?.registered && (
                <p className="alert alert-success py-2 mb-3" role="alert">
                  Account created successfully. Please sign in.
                </p>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>

                  <input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={handleChange}
                  />

                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    {/* 
                <Link
                  to="/forgot-password"
                  className="small text-decoration-none"
                  style={{ color: "#53662c" }}
                >
                  Forgot password?
                </Link> */}
                  </div>
                  <div className="input-group">
                    <input
                      ref={passwordRef}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="input-group-text border-start-0"
                      onClick={() => {
                        setShowPassword((prev) => !prev);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>
                {serverError && (
                  <div className="alert alert-danger" role="alert">
                    <p>{serverError}</p>
                  </div>
                )}
                <button
                  type="submit"
                  className="btn search-btn register-btn w-100"
                >
                  Sign In
                </button>

                <p className="text-center text-muted mt-4 mb-0">
                  Don't have an account?
                  <Link
                    to="/register"
                    className="text-decoration-none fw-semibold ms-2 text-dark"
                  >
                    Sign Up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
