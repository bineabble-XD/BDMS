import React, { useState } from "react";

const API_BASE = "http://localhost:5050";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sentiment, setSentiment] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSentiment(null);
    try {
      const user = JSON.parse(localStorage.getItem("bdmsUser") || "null");
      const res = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          text,
          userId: user?._id || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSentiment(data.feedback?.sentiment || "neutral");
        setRating(0);
        setHover(0);
        setText("");
      } else {
        setError(data.message || "Failed to submit feedback.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
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

            {error && <p className="text-danger small mb-2">{error}</p>}
            {sentiment && (
              <p className="mb-2">
                <span className="badge bg-success me-1">Saved</span>
                <span className="text-muted small">
                  Sentiment: <strong>{sentiment}</strong>
                </span>
              </p>
            )}

            <button type="submit" className="btn btn-danger feedback-submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
