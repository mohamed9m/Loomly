import { useEffect, useReducer, useState } from "react";
import { useAuth } from "../context/AuthContext";
import cartReducer from "../reducers/cartReducer";
import axiosInstance from "../api/axios";
import { CartContext } from "../context/CartContext";
import formatCartProducts from "../scripts/formatCartProducts";

const initCart = () => {
  //Lazy initialization function to get the cart from localStorage
  try {
    return JSON.parse(localStorage.getItem("guest_cart")) || [];
  } catch {
    return [];
  }
};

export default function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, null, initCart);
  const { isAuthenticated, authInitialized } = useAuth();
  const [cartLoading, setCartLoading] = useState(true);
  const fetchCart = async () => {
    try {
      const { data } = await axiosInstance.get("/cart");
      const products = formatCartProducts(data.cart);

      console.log(products);
      dispatch({ type: "SET_CART", payload: products });
      setCartLoading(false);
    } catch (e) {
      setCartLoading(false);
      console.log(e);
    }
  };
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("guest_cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (!isAuthenticated || !authInitialized) {
        setCartLoading(false);
        return;
      }

      try {
        const savedGuestCart =
          JSON.parse(localStorage.getItem("guest_cart")) || [];

        if (savedGuestCart.length > 0) {
          const { data } = await axiosInstance.post("/cart/merge", {
            items: savedGuestCart,
          });
          const products = formatCartProducts(data.cart);
          dispatch({ type: "SET_CART", payload: products });
          setCartLoading(false);
          localStorage.removeItem("guest_cart");
        } else {
          fetchCart();
        }
      } catch (err) {
        console.error(err);
      }
    };

    syncCartOnLogin();
  }, [isAuthenticated, authInitialized]);
  return (
    <CartContext.Provider value={{ cart, dispatch, cartLoading }}>
      {children}
    </CartContext.Provider>
  );
}
