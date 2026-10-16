import axiosInstance from "./api/axios";
import { useState, useEffect } from "react";
import ProductsData from "./context/ProductsData";
import { Route, Routes, useSearchParams } from "react-router-dom";
import "./App.css";
import AuthProvider from "./components/AuthProvider";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Details from "./pages/ProductDetails";
import About from "./pages/About";
import Products from "./components/Products";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import QuickCheckout from "./pages/QuickCheckout";
import ThankYou from "./pages/ThanksPage";
import NotFound from "./pages/NotFound";
import CartProvider from "./components/CartProvider";
function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/product");
        const productsData = data;
        setProducts(productsData.products);
      } catch (err) {
        setProducts([]);
        console.error(err);
      } finally {
        setLoading(false);
        console.log("Data fetched");
      }
    };
    fetchProducts();
  }, []);
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <ProductsData.Provider
      value={{
        products,
        setProducts,
        searchParams,
        setSearchParams,
        loading,
      }}
    >
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" Component={Home} />
              <Route path="/products" Component={Products} />
              <Route path="/cart" Component={Cart} />
              <Route path="/products/:id" Component={Details} />
              <Route path="/contact" Component={Contact} />
              <Route path="/about" Component={About} />
              <Route path="/thanks" Component={ThankYou} />
              <Route path="/profile" Component={Profile} />
            </Route>
            <Route path="/register" Component={Register} />
            <Route path="/login" Component={Login} />
            <Route path="/checkout" Component={Checkout} />
            <Route path="/checkout/:id" Component={QuickCheckout} />
            <Route path="*" Component={NotFound} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ProductsData.Provider>
  );
}

export default App;
