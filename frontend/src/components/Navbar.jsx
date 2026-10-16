import { ShoppingBag, Search, UserRound, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
function NavBar() {
  const { cart } = useCart();
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchOverlayRef = useRef(null);
  const cartQuantity = cart.reduce(
    (total, product) => total + product.quantity,
    0,
  );
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  // Focus input when open
  useEffect(() => {
    if (searchOpen && searchOverlayRef.current) {
      const input = searchOverlayRef.current.querySelector("input");
      input?.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.scrollTo(0, 0);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      if (!prev) setSearchQuery("");
      return !prev;
    });
  };
  const closeMenuAndNavigate = () => {
    window.scrollTo(0, 0);
    setSearchOpen(false);
  };

  return (
    <>
      {/* Search Overlay - Full width, slides down from top of navbar */}
      {searchOpen && (
        <div
          ref={searchOverlayRef}
          className="search-overlay position-fixed top-0 start-0 w-100 animate-slide-down"
          style={{
            backgroundColor: "var(--bg-nav)",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            paddingTop: ".6rem",
            paddingBottom: ".6rem",
            zIndex: 1040,
          }}
          onClick={(e) => e.stopPropagation()}
          role="search"
        >
          <div className="container">
            <form
              onSubmit={handleSearchSubmit}
              className="d-flex align-items-center gap-2 w-100 "
            >
              <label htmlFor="nav-search" className="visually-hidden">
                Search products
              </label>

              <div
                className="search-bar border d-flex align-items-center flex-grow-1 rounded-2 shadow-sm p-1"
                style={{ backgroundColor: "var(--bs-body-bg)" }}
              >
                <input
                  id="nav-search"
                  className="form-control form-control-lg border-0 shadow-none flex-grow-1 search-input"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: "0.6rem 1rem", fontSize: "1.05rem" }}
                />
                <button
                  type="submit"
                  className="btn rounded-2 border-0 d-flex align-items-center justify-content-center"
                  disabled={!searchQuery.trim()}
                  aria-label="Search"
                >
                  <Search size={27} strokeWidth={2} />
                </button>
              </div>

              <button
                type="button"
                className="btn search-close d-flex align-items-center justify-content-center"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                aria-label="Close search"
              >
                <X size={27} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`navbar navbar-expand-lg shadow-sm sticky-top py-xl-2 ${searchOpen ? "search-active" : ""}`}
        style={{
          backgroundColor: "var(--bg-nav)",
          zIndex: searchOpen ? 1030 : 1020,
          transition: "box-shadow 0.2s ease, z-index 0s 0.2s",
        }}
      >
        <div className="container">
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setSearchOpen(false)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Logo */}
          <Link
            className="navbar-brand me-auto me-lg-0 fw-bold"
            to={"/"}
            onClick={closeMenuAndNavigate}
            aria-label="Loomly Home"
          >
            <svg
              width="72"
              height="40"
              viewBox="0 0 72 72"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="loomGradIcon"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#A3B37E" />
                  <stop offset="100%" stopColor="#7C8C5C" />
                </linearGradient>
              </defs>

              <rect
                x="0"
                y="0"
                width="72"
                height="72"
                rx="18"
                fill="url(#loomGradIcon)"
              />

              <path
                d="M20 16 V52 H54"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              <path
                d="M20 26 H33"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.55"
              />
              <path
                d="M20 36 H33"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.55"
              />
              <path
                d="M20 46 H40"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.55"
              />

              <circle cx="54" cy="52" r="4.5" fill="#ffffff" />
            </svg>
          </Link>

          {/* Right Action Icons */}
          <div className="d-flex align-items-center gap-2 gap-lg-3 ms-0 ms-lg-auto">
            <button
              className="btn btn-link p-0 position-relative"
              style={{
                fontSize: "1.25rem",
                lineHeight: 1,
                color: "var(--text-primary)",
              }}
              onClick={toggleSearch}
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              aria-controls="nav-search"
            >
              <Search />
            </button>

            <Link
              className="position-relative"
              style={{ fontSize: "1.25rem", lineHeight: 1 }}
              to="/cart"
              onClick={closeMenuAndNavigate}
            >
              <ShoppingBag strokeWidth={1.75} />
              {cartQuantity > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge d-flex align-items-center rounded-pill"
                  style={{
                    fontSize: "0.7rem",
                    height: 20,
                    minWidth: 20,
                    backgroundColor: "#91b44a",
                    color: "black",
                  }}
                >
                  {cartQuantity}
                </span>
              )}
            </Link>

            {isLoading ? (
              <div
                className="spinner-border spinner-border-sm"
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  color: "var(--text-primary)",
                }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className="d-flex align-items-center ms-sm-1 ms-lg-0"
                style={{ fontSize: "1.4rem" }}
                onClick={closeMenuAndNavigate}
              >
                <UserRound />
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Collapse Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="d-lg-none border-bottom pb-3 mb-2 mt-4 px-2">
              <h5 className="fw-bold mb-0 text-muted">Menu</h5>
            </div>

            <ul className="navbar-nav ms-lg-auto mb-2 mb-lg-0 gap-lg-4 mt-3 mt-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link fw-medium px-3 px-lg-0 py-3 py-lg-2 rounded hover-bg-light"
                  to="/"
                  onClick={closeMenuAndNavigate}
                >
                  <i className="fa-solid fa-house me-3 d-lg-none text-muted"></i>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/products"
                  className="nav-link fw-medium px-3 px-lg-0 py-3 py-lg-2 rounded hover-bg-light"
                  onClick={closeMenuAndNavigate}
                >
                  <i className="fa-solid fa-box me-3 d-lg-none text-muted"></i>{" "}
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/about"
                  className="nav-link fw-medium px-3 px-lg-0 py-3 py-lg-2 rounded hover-bg-light"
                  onClick={closeMenuAndNavigate}
                >
                  <i className="fa-solid fa-circle-info me-3 d-lg-none text-muted"></i>{" "}
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/contact"
                  className="nav-link fw-medium px-3 px-lg-0 py-3 py-lg-2 rounded hover-bg-light"
                  onClick={closeMenuAndNavigate}
                >
                  <i className="fa-solid fa-envelope me-3 d-lg-none text-muted"></i>{" "}
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
