import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/8+.png";
import { extractNlpLocal } from "../utils/nlpLocalFallback";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const NLPAssistant = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [intent, setIntent] = useState("");
  const [hints, setHints] = useState([]);

  const applyResult = (data) => {
    setBloodType(data.bloodType || "");
    setLocation(data.location || "");
    setUrgency(data.urgency || "");
    setQuantity(data.quantity != null ? String(data.quantity) : "");
    setMessage(data.message || "");
    setSentiment(data.sentiment || null);
    setIntent(data.intent || "");
    setHints(Array.isArray(data.hints) ? data.hints : []);
  };

  const analyzeText = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/nlp/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        applyResult(data);
      } else {
        setError(data.message || t("nlpErrAnalyze"));
        applyResult(extractNlpLocal(trimmed));
      }
    } catch {
      setError(t("nlpErrOffline"));
      applyResult(extractNlpLocal(trimmed));
    } finally {
      setAnalyzing(false);
    }
  };

  const clearAll = () => {
    setInput("");
    setBloodType("");
    setLocation("");
    setUrgency("");
    setQuantity("");
    setMessage("");
    setError("");
    setSentiment(null);
    setIntent("");
    setHints([]);
  };

  const handleCreateUrgentRequest = () => {
    const validBloodType = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodType);
    if (!validBloodType) return;
    const parts = [location, urgency ? `Urgency: ${urgency}` : "", message ? message.slice(0, 200) : ""].filter(
      Boolean
    );
    const composed = parts.join(". ") || input.trim().slice(0, 200);
    navigate("/urgent", {
      state: {
        nlpPrefill: {
          bloodType,
          quantity: quantity ? parseInt(quantity, 10) || 1 : 1,
          message: composed,
        },
      },
    });
  };

  const canCreateRequest = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodType);

  const sentimentBadgeClass =
    sentiment?.sentiment === "positive"
      ? "success"
      : sentiment?.sentiment === "negative"
        ? "danger"
        : "secondary";

  return (
    <div
      className="nlp-page"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <div className="container py-5">
        <div className="row align-items-start g-5">
          <div className="col-lg-6">
            <p className="text-muted mb-1">{t("nlpBadge")}</p>
            <h2 className="fw-bold mb-3">{t("nlpTitle")}</h2>
            <p className="mb-4">{t("nlpIntro")}</p>

            <div className="p-3 rounded shadow-sm border">
              <h6 className="fw-semibold mb-2">{t("nlpStep1")}</h6>

              <textarea
                className="form-control mb-3"
                rows="5"
                placeholder={t("nlpPlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              {error && <p className="small text-warning mb-2">{error}</p>}

              <button
                type="button"
                className="btn btn-danger w-100 mb-2"
                onClick={analyzeText}
                disabled={analyzing || !input.trim()}
              >
                {analyzing ? t("nlpAnalyzing") : t("nlpAnalyze")}
              </button>
              <button type="button" className="btn btn-outline-secondary w-100" onClick={clearAll}>
                {t("nlpClear")}
              </button>
            </div>
          </div>

          <div className="col-lg-6">
            <img
              src={heroImg}
              alt={t("nlpAltImg")}
              className="img-fluid mb-4"
              style={{ borderRadius: "16px" }}
            />

            <div className="p-3 rounded shadow-sm border mb-4">
              <h6 className="fw-semibold mb-3">{t("nlpStep2")}</h6>

              <div className="d-flex justify-content-between pb-2 border-bottom">
                <span>{t("nlpBloodType")}</span>
                <strong>{bloodType || "—"}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>{t("nlpQuantity")}</span>
                <strong>{quantity !== "" ? quantity : "1"}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>{t("nlpLocation")}</span>
                <strong className="text-end ms-2">{location || "—"}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>{t("nlpUrgency")}</span>
                <span
                  className={`badge bg-${
                    urgency === "High" ? "danger" : urgency === "Medium" ? "warning" : "secondary"
                  }`}
                >
                  {urgency || "—"}
                </span>
              </div>
              {intent && (
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span>{t("nlpIntent")}</span>
                  <small className="text-muted text-end">{intent.replace(/_/g, " ")}</small>
                </div>
              )}
              {hints.length > 0 && (
                <div className="pt-2 small text-muted">
                  {t("nlpSignals")} {hints.join(", ")}
                </div>
              )}
            </div>

            <div className="p-3 rounded shadow-sm border mb-4">
              <h6 className="fw-semibold mb-3">{t("nlpStep3")}</h6>
              {sentiment ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>{t("nlpOverall")}</span>
                    <span className={`badge bg-${sentimentBadgeClass}`}>{sentiment.label || sentiment.sentiment}</span>
                  </div>
                  <p className="small text-muted mb-0">
                    {t("nlpScoreNote")}{" "}
                    {typeof sentiment.score === "number" ? sentiment.score.toFixed(2) : "—"} {t("nlpScoreSuffix")}
                  </p>
                </>
              ) : (
                <p className="small text-muted mb-0">{t("nlpRunSentiment")}</p>
              )}
            </div>

            <div className="p-3 rounded shadow-sm border">
              <h6 className="fw-semibold mb-3">{t("nlpStructuredTitle")}</h6>

              <p className="mb-1 small">
                <strong>{t("nlpStructuredBlood")}</strong> {bloodType || "—"}
              </p>
              <p className="mb-1 small">
                <strong>{t("nlpStructuredQty")}</strong> {quantity !== "" ? quantity : "1"}
              </p>
              <p className="mb-1 small">
                <strong>{t("nlpStructuredLoc")}</strong> {location || "—"}
              </p>
              <p className="mb-1 small">
                <strong>{t("nlpStructuredUrg")}</strong> {urgency || "—"}
              </p>
              {message && (
                <p className="mb-0 mt-2 small text-muted border-top pt-2">
                  <strong>{t("nlpStructuredMsg")}</strong> {message.length > 180 ? `${message.slice(0, 180)}…` : message}
                </p>
              )}

              {canCreateRequest && (
                <button type="button" className="btn btn-danger w-100 mt-3" onClick={handleCreateUrgentRequest}>
                  {t("nlpCreateUrgent")}
                </button>
              )}
              {!canCreateRequest && bloodType === "" && input.trim() && !analyzing && (
                <p className="small text-muted mt-2 mb-0">{t("nlpEnableHint")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLPAssistant;
