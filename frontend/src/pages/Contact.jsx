import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(formData);
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Contact Us</h1>
        <p className="text-muted">
          Have a question? We'd love to hear from you.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-control"
                rows="6"
                required
              />
            </div>

            <button
              type="submit"
              className="btn border-0 rounded-3 px-5 cart-add-btn"
              style={{ height: 45 }}
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="ps-lg-4">
            <h3 className="fw-semibold mb-4">Get in touch</h3>

            <p className="text-muted">
              We're here to help with any questions about our products, orders,
              or your shopping experience.
            </p>

            <div className="mt-4">
              <p>
                <i className="fa-solid fa-envelope me-3 text-success"></i>
                support@loomly.com
              </p>

              <p>
                <i className="fa-solid fa-phone me-3 text-success"></i>
                +20 1228169704
              </p>

              <p>
                <i className="fa-solid fa-location-dot me-3 text-success"></i>
                Egypt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
