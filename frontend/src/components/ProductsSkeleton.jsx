function ProductSkeleton() {
  return (
    <div
      className="card border-0 col-md-6 col-xl-3 col-lg-4 col-sm-12"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div
        className="placeholder-glow bg-light rounded-2"
        style={{ height: 250 }}
      >
        <span className="placeholder w-100 h-100"></span>
      </div>

      <div className="card-body ps-2 pe-3">
        <h6 className="placeholder-glow">
          <span className="placeholder col-8"></span>
        </h6>

        <p className="placeholder-glow">
          <span className="placeholder col-4"></span>
        </p>

        <button className="btn btn-secondary disabled placeholder col-6"></button>
      </div>
    </div>
  );
}
export default ProductSkeleton;
