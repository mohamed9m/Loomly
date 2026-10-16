import { useParams, Link } from "react-router-dom";
import { useContext, useState } from "react";
import ProductsData from "../context/ProductsData";
import Products from "../components/Products";
import { useCart } from "../context/CartContext";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import formatCartProducts from "../scripts/formatCartProducts";

function ProductDetails() {
  const [loading, setLoading] = useState(false);
  const { products } = useContext(ProductsData);
  const { dispatch } = useCart();
  const productId = useParams().id;
  console.log(productId);
  const product = products.find((item) => item._id === productId);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        dispatch({ type: "ADD", payload: { ...product, quantity: 1 } });
        setLoading(false);
        return;
      }
      const { data } = await axiosInstance.post(`/cart/${product._id}`); // DB is source of truth for cart
      console.log(data);
      const products = formatCartProducts(data.cart);

      console.log(products);
      dispatch({ type: "SET_CART", payload: products });
      setLoading(false);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  if (!product) return <></>;
  console.log(product);
  return (
    <>
      <div
        className=" card p-0 border-0 mt-lg-5 mt-3 container"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="row mx-0 g-lg-5 ">
          <div className="col-md-6">
            <img
              src={product.images[0]}
              alt={product.title}
              className="img-fluid rounded-4 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold text-center">
                {product.title}
              </h5>
              <p className="text-muted text-start">{product.description}</p>
              <h4 className="fw-bold" style={{ color: "var(--accent-color)" }}>
                ${product.price}
              </h4>
              <ul className="list-unstyled small text-muted mb-3">
                <li>
                  <strong>Category:</strong> {product.category}
                </li>
              </ul>
              <div>
                <button
                  className="btn border-0 rounded-3 ps-5 w-75 pe-5 cart-add-btn"
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm "
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
                <Link to={`/checkout/${product._id}`}>
                  <button
                    className="btn btn-dark mt-3 rounded-3 ps-5 w-75 pe-5"
                    style={{ height: 45 }}
                  >
                    Buy Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="my-5 pb-1 pt-4 text-center text-lg-start">
          <h2 className="fw-normal text-center text-lg-start ps-lg-4">
            You Might Also Like
          </h2>
        </div>
        <Products />
      </div>
    </>
  );
}

export default ProductDetails;
