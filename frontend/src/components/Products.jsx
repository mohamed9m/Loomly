import { useContext } from "react";
import ProductsData from "../context/ProductsData";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import ProductSkeleton from "./ProductsSkeleton";

export default function Products() {
  const { products, loading } = useContext(ProductsData);

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const visibleProducts = search
    ? products.filter((product) =>
        product.title.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  // Still loading — show skeletons
  if (loading) {
    return (
      <div
        id="products"
        className="container mt-4 mb-3"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="row mx-0 g-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  //In case API returned nothing
  if (products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 className="fw-normal">No products available right now</h2>
        <p className="text-muted">
          Please check back later or refresh the page.
        </p>
      </div>
    );
  }

  // Products exist, but the search value matched none of them
  if (search && visibleProducts.length === 0) {
    return (
      <>
        <div className="container py-5 text-center">
          <h2 className="fw-medium mb-4">
            Search results for
            <span className="ms-2" style={{ color: "var(--accent-dark)" }}>
              {search}
            </span>
          </h2>
          <h2 className="fw-normal">No Matching Results</h2>
          <Link to="/products">
            <button
              className="btn border-0 btn-primary mt-3 rounded-5 px-5 cart-add-btn"
              style={{ height: 45 }}
            >
              Continue Shopping
            </button>
          </Link>
        </div>
        <div id="products" className="container mt-4 mb-3">
          <h2 className="fw-medium mb-4">Other Products</h2>
          <div className="row mx-0 g-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </>
    );
  }

  // Normal case — full product list, or matching search results
  return (
    <div id="products" className="container mt-4 mb-3">
      <div className="row mx-0 g-5">
        {search && (
          <h2 className="fw-medium mb-4">
            Search results for
            <span className="ms-2" style={{ color: "var(--accent-dark)" }}>
              {search}
            </span>
          </h2>
        )}

        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
