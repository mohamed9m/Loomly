import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import axiosInstance from "./api/axios";
import { useState, useReducer, useEffect } from "react";
import ProductsData from "./context/ProductsData";
import cartReducer from "./reducers/cartReducer";
import { Route, Routes, useSearchParams } from "react-router-dom";
import "./App.css";
import AuthProvider from "./components/AuthProvider";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Details from "./pages/Details";
import About from "./pages/About";
import ProductsPage from "./pages/ProductsPage";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import QuickCheckout from "./pages/QuickCheckout";
import ThankYou from "./pages/ThanksPage";
import NotFound from "./pages/NotFound";
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
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <div className="min-vh-100 d-flex flex-column">
        <ProductsData.Provider
          value={{
            products,
            setProducts,
            cart,
            dispatch,
            searchParams,
            setSearchParams,
            loading,
          }}
        >
          <AuthProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" Component={Home} />
                <Route path="/products" Component={ProductsPage} />
                <Route path="/cart" Component={Cart} />
                <Route path="/products/:id" Component={Details} />
                <Route path="/checkout" Component={Checkout} />
                <Route path="/checkout/:id" Component={QuickCheckout} />
                <Route path="/contact" Component={Contact} />
                <Route path="/about" Component={About} />
                <Route path="/thanks" Component={ThankYou} />
                <Route path="/register" Component={Register} />
                <Route path="/login" Component={Login} />
                <Route path="/profile" Component={Profile} />
                <Route path="*" Component={NotFound} />
              </Route>
              <Route path="*" Component={NotFound} />
            </Routes>
          </AuthProvider>
        </ProductsData.Provider>
      </div>
    </>
  );
}

export default App;
