import React, { useState } from "react";
import { Link } from "react-router-dom";
import mlogo from "../assets/mlogo.jpg";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rating:", rating);
    console.log("Feedback:", text);
    alert("Thank you for your feedback!");
    setRating(0);
    setHover(0);
    setText("");
  };

  return (
    <div className="feedback-page">
      <header className="bdms-navbar shadow-sm">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <div className="d-flex align-items-center gap-2">
            <img
              src={mlogo}
              alt="BDMS Logo"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "12px",
                objectFit: "cover",
              }}
            />
            <div className="lh-1">
              <h5 className="mb-0 fw-bold">
                <span className="text-danger">BLOOD</span> <span>DONATION</span>
              </h5>
              <small className="text-muted">MANAGEMENT SYSTEM</small>
            </div>
          </div>

          <nav className="d-none d-md-flex align-items-center gap-4">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
            <a href="#urgent" className="nav-link">
              Urgent Requests
            </a>
            <Link to="/register" className="nav-link">
              Register Now
            </Link>
            <Link to="/login" className="nav-link">
              Log In
            </Link>
          </nav>
        </div>
      </header>

      <section className="feedback-section">
        <div className="container text-center">
          <h1 className="feedback-title mb-3">Feedback</h1>
          <p className="feedback-subtitle mb-4">
            We hope your visit goes well
          </p>

          <form className="feedback-form mx-auto" onSubmit={handleSubmit}>
            <p className="mb-2 fw-semibold">
              How would you rate overall experience?
            </p>

            <div className="feedback-stars mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-btn"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <span className="star-icon">
                    {star <= (hover || rating) ? "★" : "☆"}
                  </span>
                </button>
              ))}
            </div>

            <p className="mb-2 fw-semibold">
              Kindly take a moment to tell us what you think
            </p>

            <textarea
              className="form-control feedback-textarea mb-4"
              rows="5"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your feedback here..."
            />

            <button type="submit" className="btn btn-danger feedback-submit">
              Submit Feedback
            </button>
          </form>
        </div>
      </section>

      <div className="feedback-footer-bar" />
    </div>
  );
};

export default Feedback;
