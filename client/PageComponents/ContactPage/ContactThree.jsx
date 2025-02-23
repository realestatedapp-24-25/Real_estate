import React, { useState } from "react";
import toast from "react-hot-toast";
const ContactThree = () => {
  // State to manage form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    agree: false,
  });

  // State to manage the success message
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Here, you can add any form validation or email sending logic

    // Show success message
    setSuccessMessage("Message sent successfully!");

    // Clear the form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      agree: false,
    });

    // Optionally, you can also reset the success message after a few seconds
    setTimeout(() => setSuccessMessage(""), 5000);

    toast.success("Message Send Successfully");
  };

  return (
    <div className="login-area message-area rn-section-gapTop">
      <div className="container">
        <div className="row g-5">
          <div
            className="col-lg-6"
            data-sal="slide-up"
            data-sal-delay="150"
            data-sal-duration="800"
          >
            <div className="connect-thumbnail">
              <div className="left-image">
                <img src="/contact/kkwagh.png" alt="Nft_Profile" />
              </div>
            </div>
          </div>
          <div
            className="col-lg-6"
            data-sal="slide-up"
            data-sal-delay="200"
            data-sal-duration="800"
          >
            <div className="form-wrapper-one registration-area">
              <h3 className="mb--30">Contact Us</h3>
              {/* Success message */}
              {successMessage && (
                <div className="alert alert-success mb-4" role="alert">
                  {successMessage}
                </div>
              )}
              <form
                className="rwt-dynamic-form"
                id="contact-form"
                method="POST"
                onSubmit={handleSubmit}
              >
                <div className="mb-5">
                  <label htmlFor="contact-name" className="form-label">
                    Your Name
                  </label>
                  <input
                    name="name"
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="contact-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-5">
                  <label htmlFor="contact-message" className="form-label">
                    Write Message
                  </label>
                  <textarea
                    name="message"
                    id="contact-message"
                    rows="3"
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className="mb-5 rn-check-box">
                  <input
                    id="condition"
                    type="checkbox"
                    className="rn-check-box-input"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="condition" className="rn-check-box-label">
                    Allow to all terms & condition
                  </label>
                </div>
                <button name="submit" type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactThree;
