import { Link } from "react-router-dom";

export default function ThankYou() {
  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center py-5">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
              style={{
                width: "88px",
                height: "88px",
                backgroundColor: "#7C8C5C",
              }}
            >
              <i
                className="fa-solid fa-check text-white"
                style={{ fontSize: "2.25rem" }}
              ></i>
            </div>

            <h1 className="fw-bold mb-3">Thank You for Your Order!</h1>

            <p className="text-muted fs-5 mb-5">
              Your order has been placed successfully. We're getting it ready
              and you'll receive a confirmation email shortly.
            </p>
            <Link to={"/products"} className="fw-semibold text-white">
              <button
                className="btn border-0  cart-add-btn rounded-5 px-5"
                style={{ height: 45 }}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
