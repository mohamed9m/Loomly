import { createContext, useContext } from "react";
const CartContext = createContext(undefined);

const useCart = () => {
  return useContext(CartContext);
};

export { CartContext, useCart };
