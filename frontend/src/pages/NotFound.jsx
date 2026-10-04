import { Link, useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <div className="nf-page d-flex align-items-center justify-content-center min-vh-100 position-relative overflow-hidden">
      <div className="nf-warp position-fixed top-0 start-0 w-100 h-100" aria-hidden="true" />
      <div className="nf-loose position-fixed top-0 start-50" aria-hidden="true" />

      <main className="container position-relative text-center py-5 nf-main">
        <p className="nf-code mb-0" aria-hidden="true">404</p>
        <h1 className="h3 fw-bold mt-3 mb-2">We couldn't find that page</h1>
        <p className="nf-text mx-auto mb-4">
          The link may be broken, or the page may have been moved or deleted.
          Check the address, or head back to somewhere that exists.
        </p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/" className="btn nf-btn nf-btn-primary rounded-pill px-4 py-2 fw-bold">
            Back to home
          </Link>
          <button type="button" onClick={goBack} className="btn nf-btn nf-btn-secondary rounded-pill px-4 py-2 fw-bold">
            Go back
          </button>
        </div>
      </main>
    </div>
  );
}
