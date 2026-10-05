import { useContext, useState } from "react";
import ProductsData from "../context/ProductsData";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
function CartItem({ item }) {
  const { dispatch } = useContext(ProductsData);
  const { isAuthenticated } = useAuth();
  const [quantityLoading, setQuantityLoading] = useState(false);
  const [trashLoading, setTrashLoading] = useState(false);
  const handleRemoveFromCart = async () => {
    try {
      setTrashLoading(true);
      if (isAuthenticated) {
        const { data } = await axiosInstance.delete(`/cart/${item._id}`);
        const products = data.cart.products.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        dispatch({ type: "SET_CART", payload: products });
        setTrashLoading(false);
        return;
      }
      dispatch({ type: "REMOVE", payload: item });
      setTrashLoading(false);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  const handleDecreaseFromCart = async () => {
    try {
      setQuantityLoading(true);
      if (isAuthenticated) {
        const { data } = await axiosInstance.patch(
          `/cart/${item._id}/decrease`,
        );
        const products = data.cart.products.map((item) => ({
          ...item.product,
          quantity: item.quantity,
        }));
        dispatch({ type: "SET_CART", payload: products });
        setQuantityLoading(false);
        return;
      }
      dispatch({ type: "DECREASE", payload: item });
      setQuantityLoading(false);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  const handleAddToCart = async () => {
    setQuantityLoading(true);

    try {
      if (!isAuthenticated) {
        dispatch({ type: "ADD", payload: { ...item, quantity: 1 } });
        setQuantityLoading(false);
        return;
      }
      const { data } = await axiosInstance.post(`/cart/${item._id}`); // DB is source of truth for cart
      console.log(data);
      const products = data.cart.products.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }));
      console.log(products);
      dispatch({ type: "SET_CART", payload: products });
      setQuantityLoading(false);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };
  return (
    <div key={item.id} className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="row align-items-center g-3">
          <div className="col-3 col-md-2">
            <img
              src={item.images[0]}
              alt={item.title}
              className="img-fluid rounded object-fit-cover"
            />
          </div>

          <div className="col-9 col-md-5">
            <h6 className="fw-semibold mb-1 fs-5">{item.title}</h6>
            <small className="text-muted">${item.price.toFixed(2)} each</small>
          </div>

          <div className="col-7 col-md-3">
            <div
              className="d-flex align-items-center border rounded"
              style={{ width: "fit-content" }}
            >
              <button
                className="btn btn-sm quantity-btn fs-5 px-3"
                aria-label="Decrease quantity"
                onClick={handleDecreaseFromCart}
              >
                &minus;
              </button>
              {quantityLoading ? (
                <div
                  className="spinner-border spinner-border-sm"
                  style={{
                    width: "1rem",
                    height: "1rem",
                    color: "#00000",
                  }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <span className="px-3 fw-semibold">{item.quantity}</span>
              )}
              <button
                className="btn btn-sm quantity-btn fs-5 px-3"
                aria-label="Increase quantity"
                onClick={handleAddToCart}
              >
                +
              </button>
            </div>
          </div>

          <div className="col-5 col-md-2 text-end">
            <button
              className="btn btn-sm text-danger"
              onClick={handleRemoveFromCart}
            >
              {trashLoading ? (
                <div
                  className="spinner-border spinner-border-sm"
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    color: "#00000",
                  }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <i className="fa-solid fa-trash fs-4"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
