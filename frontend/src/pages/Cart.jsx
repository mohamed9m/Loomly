import { useContext } from "react";
import { Link } from "react-router-dom";
import ProductsData from "../context/ProductsData";
import CartItem from "../components/CartItem";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
function Cart() {
  const { isLoading } = useAuth();
  const { cart } = useContext(ProductsData);
  console.log(cart);
  const totalPrice = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0,
  );

  if (isLoading) {
    return (
      <>
        <div className="container py-5 d-flex align-items-center justify-content-center vh-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  } else if (cart.length === 0) {
    return (
      <>
        <div className="container mt-5 py-5 text-center">
          <ShoppingCart
            size={100}
            strokeWidth={1.3}
            className="mb-2"
            style={{ color: "var(--accent-color)" }}
          />
          <h3 className="fw-medium fs-1 mb-2 ">No products in cart</h3>
          <p className="text-muted mb-4">
            Looks like you haven't added anything yet.
          </p>
          <Link to={"/products"}>
            <button
              className="btn border-0 btn-primary rounded-2 px-5 btn-dark"
              style={{ height: 45 }}
            >
              Continue Shopping
            </button>
          </Link>
        </div>
        {/* <Products /> */}
      </>
    );
  }

  return (
    <>
      <div className="container py-5">
        <h2 className="fw-bold mb-4">Your Cart</h2>

        {cart.map((item) => (
          <CartItem item={item} />
        ))}
      </div>
      <div className="container mb-5">
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          <div>
            <span className="text-muted d-block small">Total Price</span>

            <h3
              className="fw-bold mb-0"
              style={{ color: "var(--text-accent)" }}
            >
              ${totalPrice.toFixed(2)}
            </h3>
          </div>
          <Link
            to="/checkout"
            className="btn border-0 rounded-3 px-5 py-2 cart-add-btn d-flex align-items-center justify-content-center"
          >
            Checkout
          </Link>
        </div>
      </div>
    </>
  );
}

export default Cart;
