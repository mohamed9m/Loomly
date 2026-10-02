import { useContext, useState } from "react";
import ProductsData from "../context/ProductsData";
import governorates from "../data/governorates";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Checkout() {
  const { cart } = useContext(ProductsData);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    governorate: "",
    address: "",
  });

  const selectedGovernorate = governorates.find(
    (governorate) => governorate.id === Number(formData.governorate),
  );

  const shippingPrice = selectedGovernorate?.shippingPrice || 0;

  const subtotal = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  const total = subtotal + shippingPrice;

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log({
      customer: formData,
      items: cart,
      subtotal,
      shipping: shippingPrice,
      total,
    });
  }

  return (
    <div className="container py-5">
      <header className="text-center mb-5">
        <div className="container py-lg-3">
          <Link to="/">
            <img src={logo} alt="Loomly" style={{ height: "60px" }} />
          </Link>
        </div>
      </header>
      <h1 className="fw-bold mb-5">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Customer Information */}
          <div className="col-lg-7">
            <h3 className="fw-semibold mb-4">Customer Information</h3>

            <div className="mb-3">
              <label className="form-label fw-medium">Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-medium">Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Governorate</label>

              <select
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="" disabled>
                  Select your governorate
                </option>

                {governorates.map((governorate) => (
                  <option key={governorate.id} value={governorate.id}>
                    {governorate.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="Street, building number, apartment..."
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-5">
            <div className="border rounded-4 p-4">
              <h3 className="fw-semibold mb-4">Order Summary</h3>

              {cart.map((product) => (
                <div
                  key={product.id}
                  className="d-flex justify-content-between mb-3"
                >
                  <div className="me-3">
                    <div className="fw-medium">{product.title}</div>

                    <small className="text-muted">
                      Qty: {product.quantity}
                    </small>
                  </div>

                  <span className="fw-medium">
                    ${(product.price * product.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>

                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Shipping</span>

                <span>
                  {shippingPrice
                    ? `$${shippingPrice.toFixed(2)}`
                    : "Select governorate"}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5 fw-semibold">Total</span>

                <span className="fs-4 fw-bold" style={{ color: "#53662c" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
              <Link to={"/thanks"}>
                <button
                  type="submit"
                  className="btn w-100 mt-4 border-0 cart-add-btn rounded-3 py-2"
                >
                  Place Order
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
      <Link to="/products" className="btn rounded-3 details-btn my-3 px-4">
        ← Back to Products
      </Link>
    </div>
  );
}
