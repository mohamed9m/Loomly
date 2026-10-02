import heroImage from "../assets/loomly-hero-background.webp";
function Hero() {
  return (
    <section
      className="d-flex align-items-center mb-5  text-white position-relative"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "calc(100vh - 60px)",
      }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      ></div>

      <div
        className="container h-100 d-flex flex-column justify-content-end align-items-start position-relative"
        style={{ marginBottom: "35vh" }}
      >
        <h1 className="display-3 fw-bold mb-3 hero-header">Loomly</h1>
        <p className="lead mb-4" style={{ maxWidth: "600px" }}>
          Timeless essentials crafted from premium fabrics — built for comfort,
          made to last, and designed to move with you through every season.
        </p>
        <a href="#products">
          <button className="btn btn-light shop-now-btn px-4 py-2 fw-semibold details-btn">
            Shop Now
          </button>
        </a>
      </div>
    </section>
  );
}

export default Hero;
