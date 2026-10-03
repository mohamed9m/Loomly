import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import ProductsData from "../context/ProductsData";
import { ShoppingCartPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
function ProductCard({ product }) {
  const isAuthenticated = useAuth();
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(ProductsData);
  const handleAddToCart = async () => {
    setLoading(true);
    console.log(product);
    try {
      if (!isAuthenticated) {
        dispatch({ type: "ADD", payload: { ...product, quantity: 1 } });
        return;
      }
      const { data } = await axiosInstance.post(`/cart/${product._id}`); // DB is source of truth for cart
      console.log(data);
      const products = data.cart.products.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));
      console.log(products);
      dispatch({ type: "SET_CART", payload: products });
    } catch (err) {
      console.log(err.response.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 700);
    }
  };
  return (
    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-3">
      <div
        className="card h-100 rounded-4 overflow-hidden border shadow-sm product-card"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <Link
          className="text-decoration-none"
          to={`/products/${product.id}`}
          onClick={() => window.scrollTo(0, 0)}
        >
          <div className="ratio" style={{ "--bs-aspect-ratio": "125%" }}>
            <img
              src={product.images[0]}
              className="object-fit-cover w-100 h-100"
              alt={product.title}
              loading="lazy"
            />
          </div>
        </Link>

        <div className="card-body d-flex flex-column p-3">
          <Link
            className="text-decoration-none"
            to={`/products/${product.id}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <h6
              className="fw-semibold mb-1"
              style={{
                color: "var(--text-primary)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.6em",
              }}
              title={product.title}
            >
              {product.title}
            </h6>
          </Link>

          <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
            <span
              className="fw-bold fs-5"
              style={{ color: "var(--accent-dark)" }}
            >
              ${product.price}
            </span>

            <button
              className="btn border-0 rounded-circle direct-add-btn d-flex align-items-center justify-content-center p-0"
              style={{ width: 42, height: 42 }}
              onClick={handleAddToCart}
              disabled={loading}
              aria-label="Add to cart"
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <ShoppingCartPlus size={20} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
