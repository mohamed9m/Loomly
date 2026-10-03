import { useState, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import productsData from "../context/ProductsData";
function Profile() {
  const { profile, isAuthenticated, setProfile, setToken } = useAuth();

  const { dispatch } = useContext(productsData);
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await axiosInstance.post("/auth/logout");
      setProfile(null);
      setToken(null);
      dispatch({ type: "CLEAR" });
      navigate("/login", { replace: true });
    } catch (err) {
      console.log(err.response?.data?.message ?? err.message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <main className="container py-5">
      <div className="row g-4 justify-content-center">
        {/* Profile header */}
        <div className="col-12 col-lg-8">
          <section className="bg-white border rounded-4 shadow-sm overflow-hidden">
            <div className="p-4 p-md-5 bg-light border-bottom">
              <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-center gap-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold fs-2"
                  style={{
                    width: "90px",
                    height: "90px",
                    backgroundColor: "#f3f0e8",
                    color: "var(--accent-dark)",
                  }}
                >
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="text-center text-sm-start">
                  <p className="text-muted small mb-1">My account</p>

                  <h2 className="fw-bold mb-1">{profile.name}</h2>

                  <p className="text-muted mb-0">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Account information */}
            <div className="p-4 p-md-5">
              <h5 className="fw-bold mb-4">Account information</h5>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-3 h-100">
                    <span className="d-block text-muted small mb-1">
                      Full name
                    </span>

                    <span className="fw-semibold">{profile.name}</span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-3 h-100">
                    <span className="d-block text-muted small mb-1">
                      Email address
                    </span>

                    <span className="fw-semibold text-break">
                      {profile.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="row g-2 mt-4">
                <div className="col-12 col-md-6">
                  <Link
                    to="/cart"
                    className="btn direct-add-btn rounded-3 py-2 w-100 text-white"
                  >
                    <i className="fa-solid fa-bag-shopping me-2"></i>
                    View my cart
                  </Link>
                </div>

                <div className="col-12 col-md-6">
                  <button
                    className="btn btn-outline-danger rounded-3 py-2 w-100"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        style={{ "--bs-spinner-border-width": "0.12em" }}
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <>
                        <i className="fa-solid fa-right-from-bracket me-2"></i>
                        Log out
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Profile;
