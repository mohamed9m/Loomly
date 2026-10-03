import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer
      className="mt-5 py-5 border-top"
      style={{ backgroundColor: "#FAF9F6" }}
    >
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6">
            <h4 className="fw-bold">Loomly</h4>
            <p className="text-muted mb-0">Simple fashion. Everyday style.</p>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="fw-semibold">Shop</h6>

            <Link
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              to="/products"
              className="d-block text-muted text-decoration-none"
            >
              Products
            </Link>

            <Link
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              to="/cart"
              className="d-block text-muted text-decoration-none"
            >
              Cart
            </Link>
          </div>

          <div className="col-6 col-md-3">
            <h6 className="fw-semibold">Support</h6>

            <Link
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              to="/about"
              className="d-block text-muted text-decoration-none"
            >
              About
            </Link>

            <Link
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              to="/contact"
              className="d-block text-muted text-decoration-none"
            >
              Contact
            </Link>
          </div>
        </div>

        <hr className="my-4" />

        <p className="text-muted small mb-0">
          &copy; 2026 Loomly. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
