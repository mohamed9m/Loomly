import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import axiosInstance from "../api/axios";
function Profile() {
  const { profile, isAuthenticated, setProfile, setToken } = useAuth();

  const { dispatch } = useCart();
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
      localStorage.removeItem("guest_cart");
      navigate("/login", { replace: true });
    } catch (err) {
      console.log(err.response?.data?.message ?? err.message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <main className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden text-center">
              {/* Profile Header */}
              <div className="p-5 border-bottom bg-light bg-opacity-50">
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-1 mb-3 shadow-sm"
                  style={{
                    width: "96px",
                    height: "96px",
                    backgroundColor: "var(--bg-card, #fff)",
                    color: "var(--text-accent, #333)",
                  }}
                >
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="fw-bold mb-1">{profile.name}</h3>
                <p className="text-muted mb-0">{profile.email}</p>
              </div>

              {/* Actions */}
              <div className="card-body p-4 p-md-5">
                <div className="d-flex flex-column gap-3">
                  <Link
                    to="/cart"
                    className="btn direct-add-btn rounded-3 w-100 py-3 text-white fw-medium d-flex align-items-center justify-content-center gap-2"
                  >
                    <i className="fa-solid fa-bag-shopping"></i>
                    View My Cart
                  </Link>

                  <button
                    className="btn btn-light text-danger border border-danger-subtle rounded-3 py-3 fw-medium d-flex align-items-center justify-content-center gap-2 hover-danger"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      <>
                        <i className="fa-solid fa-right-from-bracket"></i>
                        Log Out
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Profile;
