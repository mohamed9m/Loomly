import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const [registring, setRegistring] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Using useRef to focus on invalid inputs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }
  const validate = () => {
    const nextErrors = {}; // reseted to empty object in new Render when errors State rerenders and old errors still stored in errors State

    if (form.name.trim().length < 3) {
      nextErrors.name = "Name must be at least 3 characters.";
    }

    if (!emailRegex.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!passwordRegex.test(form.password)) {
      nextErrors.password =
        "Password must be at least 8 characters and include one uppercase letter and one number.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);

    if (nextErrors.name) nameRef.current?.focus();
    else if (nextErrors.email) emailRef.current?.focus();
    else if (nextErrors.password) passwordRef.current?.focus();
    else if (nextErrors.confirmPassword) confirmPasswordRef.current?.focus();
    return Object.keys(nextErrors).length === 0; //return true if no errors
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
      setRegistring(true);
      setServerError(""); // Clear any previous server error before making the request
      const response = await axiosInstance.post(
        "/auth/register",
        JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log(response.data);
      setRegistring(false);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      const status = err.response?.status;
      if (status === 400) {
        setServerError("Please check the submitted data.");
      } else if (status === 409) {
        setServerError("This email is already registered. Go to login page");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="container min-vh-100 d-flex flex-column py-4">
      <div className="text-center mt-3 mb-5 mb-lg-0">
        <Link to="/" aria-label="Go to home">
          <svg
            width="300"
            height="60"
            viewBox="0 0 260 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="loomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
              fill="var(--text-primary)"
            >
              Loomly
            </text>
          </svg>
        </Link>
      </div>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div
          className="card register-form mx-auto w-100"
          style={{ maxWidth: "500px" }}
        >
          <div className="card-body p-4">
            <h2
              className="text-center mb-5 mt-2 btn-dark fw-semibold"
              style={{ padding: "10px 0", borderRadius: "5px" }}
            >
              Sign Up
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

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

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    ref={passwordRef}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
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
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.password && (
                  <div className="invalid-feedback d-block">
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <input
                    ref={confirmPasswordRef}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="input-group-text border-start-0"
                    onClick={() => {
                      setShowConfirmPassword((prev) => !prev);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
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
                className="btn search-btn register-btn w-100 "
              >
                {registring ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ "--bs-spinner-border-width": "0.12em" }}
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Create Account"
                )}
              </button>

              <p className="text-center text-muted mt-4 mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-decoration-none fw-semibold">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
