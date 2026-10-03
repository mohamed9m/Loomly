import { useParams, Link } from "react-router-dom";
import { useContext, useState } from "react";
import ProductsData from "../context/ProductsData";

function ProductDetails() {
  const [loading, setLoading] = useState(false);
  const { products, dispatch } = useContext(ProductsData);
  const handleAddToCart = () => {
    setLoading(true);
    dispatch({
      type: "addToCart",
      payload: { ...currentProduct, quantity: 1 },
    });
    setTimeout(() => {
      setLoading(false);
    }, 700);
  };
  const { id } = useParams();
  const currentProduct = products.find((item) => item.id === Number(id));
  if (!currentProduct) return <></>;
  console.log(currentProduct);
  return (
    <>
      <div
        className=" card p-0 border-0 mt-lg-5 mt-3 container"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="row mx-0 g-lg-5 ">
          <div className="col-md-6">
            <img
              src={currentProduct.images[0]}
              alt={currentProduct.title}
              className="img-fluid rounded-4 h-100"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6">
            <div className="card-body text-center">
              <h5 className="card-title fw-bold text-center">
                {currentProduct.title}
              </h5>
              <p className="text-muted text-start">
                {currentProduct.description}
              </p>
              <h4 className="fw-bold" style={{ color: "var(--accent-dark)" }}>
                ${currentProduct.price}
              </h4>
              <ul className="list-unstyled small text-muted mb-3">
                <li>
                  <strong>Category:</strong> {currentProduct.category}
                </li>
              </ul>
              <div>
                <button
                  className="btn border-0 rounded-5 ps-5 w-75 pe-5 cart-add-btn"
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
                <Link to={`/checkout/${id}`}>
                  <button
                    className="btn btn-dark mt-3 rounded-5 ps-5 w-75 pe-5"
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
        <h2 className="fw-bolder mb-3 text-center text-lg-start mb-lg-4 mt-5">
          Similer Items You Might Like
        </h2>
      </div>
    </>
  );
}

export default ProductDetails;
