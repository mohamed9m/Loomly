import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-3" style={{ color: "#91b44a" }}>
                About <span className="text-dark">Loomly</span>
              </h1>
              <p className="text-muted fs-5">
                Loomly App is an e-commerce application built with React and
                Bootstrap.
              </p>
            </div>

            <div className="row g-4">
              {/* Features Card */}
              <div className="col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className=" bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "var(--accent-color)",
                        }}
                      >
                        <i className="fa-solid fa-list-check fs-5"></i>
                      </div>
                      <h4 className="fw-bold mb-0">Features</h4>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-start mb-2">
                        <i
                          className="fa-solid fa-check me-2 mt-1"
                          style={{ color: "var(--accent-dark)" }}
                        ></i>
                        <span>Browse products</span>
                      </li>
                      <li className="d-flex align-items-start mb-2">
                        <i
                          className="fa-solid fa-check me-2 mt-1"
                          style={{ color: "var(--accent-dark)" }}
                        ></i>
                        <span>View product details</span>
                      </li>
                      <li className="d-flex align-items-start mb-2">
                        <i
                          className="fa-solid fa-check me-2 mt-1"
                          style={{ color: "var(--accent-dark)" }}
                        ></i>
                        <span>Add/remove products from cart</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i
                          className="fa-solid fa-check me-2 mt-1"
                          style={{ color: "var(--accent-dark)" }}
                        ></i>
                        <span>Manage cart state</span>
                      </li>
                      <li className="d-flex align-items-start mt-2">
                        <i
                          className="fa-solid fa-check me-2 mt-1"
                          style={{ color: "var(--accent-dark)" }}
                        ></i>
                        <span>Fast and responsive experience</span>
                      </li>
                      <li className="d-flex align-items-start mt-2">
                        <i
                          className="fa-solid fa-check me-2 mt-1"
                          style={{ color: "var(--accent-dark)" }}
                        ></i>
                        <span>Clean and intuitive user experience</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Built With Card */}
              <div className="col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "var(--accent-color)",
                        }}
                      >
                        <i className="fa-solid fa-code fs-5"></i>
                      </div>
                      <h4 className="fw-bold mb-0">Built With</h4>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-dark px-3 py-2">React</span>

                      <span
                        className="badge px-3 py-2"
                        style={{ backgroundColor: "var(--accent-dark)" }}
                      >
                        Bootstrap
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
