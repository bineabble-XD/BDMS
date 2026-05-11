import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/8+.png";
import { extractNlpLocal } from "../utils/nlpLocalFallback";
import { useLanguage } from "../context/LanguageContext";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5050";

const VALID_BLOOD_TYPES = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-",
];

const PIE_COLORS = [
  "#e63946",
  "#457b9d",
  "#2a9d8f",
  "#f4a261",
  "#9b5de5",
  "#4cc9f0",
  "#ff006e",
  "#6c757d",
];

const PROGRESS_BAR_CLASSES = ["bg-danger", "bg-primary", "bg-success", "bg-warning"];

/** Map server PDF errors to translated strings (keys: nlpErrPdf*). */
function pdfApiErrorMessage(status, serverMessage, t) {
  const m = String(serverMessage || "").toLowerCase();
  if (status === 404 || status === 502 || status === 503) {
    return t("nlpErrPdfNetwork");
  }
  if (status === 400 && (m.includes("5mb") || m.includes("5 mb") || m.includes("smaller"))) {
    return t("nlpErrPdfSize");
  }
  if (
    status === 400 &&
    (m.includes("only pdf") ||
      m.includes("invalid upload") ||
      m.includes("not allowed"))
  ) {
    return t("nlpErrPdfType");
  }
  if (status === 422 || m.includes("no readable text")) {
    return t("nlpErrPdfNoText");
  }
  if (
    m.includes("could not read this pdf") ||
    m.includes("password-protected") ||
    m.includes("corrupt")
  ) {
    return t("nlpErrPdfUnreadable");
  }
  if (m.includes("no pdf file") || m.includes('form field "file"')) {
    return t("nlpErrPdfScan");
  }
  if (m.includes("pdf analysis failed")) {
    return t("nlpErrPdfScan");
  }
  return t("nlpErrPdfScan");
}

function sanitizeLocation(raw) {
  return (raw || "")
    .replace(/required at/i, "")
    .replace(/needed at/i, "")
    .replace(/at/i, "")
    .trim();
}

function urgencyBadgeVariant(urgency) {
  if (urgency === "High") return "danger";
  if (urgency === "Medium") return "warning";
  return "secondary";
}

function translateUrgencyForDisplay(urgency, t) {
  if (!urgency) return "";
  if (urgency === "High") return t("nlpUrgencyHighLabel");
  if (urgency === "Medium") return t("nlpUrgencyMediumLabel");
  if (urgency === "Low") return t("nlpUrgencyLowLabel");
  return urgency;
}

function formatConfidencePercent(raw) {
  if (raw === "" || raw == null) return "";
  const n = typeof raw === "number" ? raw : parseFloat(String(raw), 10);
  if (Number.isNaN(n)) return "";
  return `${Math.round(n * 100)}%`;
}

function NlpDetailRow({ label, value, t, valueClass = "" }) {
  const display =
    value !== "" && value != null && String(value).trim() !== ""
      ? value
      : t("nlpNotDetected");
  return (
    <div className="d-flex justify-content-between py-2 border-bottom align-items-start">
      <span className="text-muted small me-2">{label}</span>
      <strong className={`text-end ${valueClass}`}>{display}</strong>
    </div>
  );
}

function StatRow({ dotClass, label, value, large, last }) {
  const ValueTag = large ? "h5" : "h6";
  return (
    <div className={`d-flex align-items-center${last ? "" : " mb-3"}`}>
      <div
        className={`rounded-circle ${dotClass} me-3`}
        style={{ width: 14, height: 14 }}
      />
      <div>
        <small className="text-muted">{label}</small>
        <ValueTag className="mb-0">{value}</ValueTag>
      </div>
    </div>
  );
}

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
  const [pdfScanning, setPdfScanning] = useState(false);
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [pdfScanStatus, setPdfScanStatus] = useState("");
  const [pdfError, setPdfError] = useState("");
  const [pdfSuccessVisible, setPdfSuccessVisible] = useState(false);
  const [templateDownloadError, setTemplateDownloadError] = useState("");
  const [error, setError] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [hospitalName, setHospitalName] = useState("");
  const [city, setCity] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [donorType, setDonorType] = useState("");
  const [patientCondition, setPatientCondition] = useState("");
  const [timeNeeded, setTimeNeeded] = useState("");
  const [requestType, setRequestType] = useState("");
  const [confidence, setConfidence] = useState("");
  const [source, setSource] = useState("");
  const [extractedKeywords, setExtractedKeywords] = useState([]);
  const pdfInputRef = useRef(null);

  const [analytics, setAnalytics] = useState({
    bloodTypeData: [],
    locationData: [],
    totalRequests: 0,
  });

  const derivedCharts = useMemo(() => {
    const pieData = analytics.bloodTypeData.filter((item) => item.value > 0);
    const barData = analytics.locationData.filter((item) => item.value > 0);
    const byBloodDesc = [...analytics.bloodTypeData].sort(
      (a, b) => b.value - a.value
    );
    const byLocDesc = [...analytics.locationData].sort(
      (a, b) => b.value - a.value
    );
    const rarestBlood = [...pieData].sort((a, b) => a.value - b.value)[0];
    return {
      pieData,
      barData,
      topBloodTypesRanked: byBloodDesc.slice(0, 5),
      topBloodName: byBloodDesc[0]?.name ?? "-",
      topHospitalName: byLocDesc[0]?.name ?? "-",
      rarestBloodName: rarestBlood?.name ?? "-",
    };
  }, [analytics.bloodTypeData, analytics.locationData]);

  const refreshAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/nlp/analytics`);
      const data = await res.json();
      if (res.ok) setAnalytics(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  const applyResult = (data) => {
    setBloodType(data.bloodType || "");
    setLocation(sanitizeLocation(data.location || ""));
    setUrgency(data.urgency || "");
    setQuantity(data.quantity != null ? String(data.quantity) : "");
    setMessage(data.message || "");
    setSentiment(data.sentiment || null);
    setHospitalName(data.hospitalName || "");
    setCity(data.city || "");
    setContactNumber(data.contactNumber || "");
    setDonorType(data.donorType || "");
    setPatientCondition(data.patientCondition || "");
    setTimeNeeded(data.timeNeeded || "");
    setRequestType(data.requestType || "");
    setConfidence(
      data.confidence != null && data.confidence !== "" ? String(data.confidence) : ""
    );
    setSource(data.source || "");
    setExtractedKeywords(Array.isArray(data.extractedKeywords) ? data.extractedKeywords : []);
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
        void refreshAnalytics();
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

  const validatePdfFile = (file) => {
    if (!file) return { ok: false, errorKey: null };
    const nameOk = file.name.toLowerCase().endsWith(".pdf");
    const mime = file.type || "";
    const mimeOk =
      !mime ||
      mime === "application/pdf" ||
      (mime === "application/octet-stream" && nameOk);
    if (!nameOk || !mimeOk) return { ok: false, errorKey: "nlpErrPdfType" };
    if (file.size > 5 * 1024 * 1024) return { ok: false, errorKey: "nlpErrPdfSize" };
    return { ok: true, errorKey: null };
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files?.[0];
    setPdfError("");
    setPdfSuccessVisible(false);

    if (!file) {
      setSelectedPdfName("");
      setPdfScanStatus("");
      return;
    }

    const { ok, errorKey } = validatePdfFile(file);
    if (!ok) {
      setSelectedPdfName(file.name);
      setPdfScanStatus(t("nlpPdfStatusFailed"));
      setPdfError(t(errorKey));
      return;
    }

    setSelectedPdfName(file.name);
    setPdfScanStatus(t("nlpPdfStatusReady"));
  };

  const handlePdfScan = async () => {
    const file = pdfInputRef.current?.files?.[0];
    if (!file || !selectedPdfName) {
      setPdfScanStatus(t("nlpPdfStatusFailed"));
      setPdfError(t("nlpErrPdfScan"));
      return;
    }

    const { ok, errorKey } = validatePdfFile(file);
    if (!ok) {
      setPdfScanStatus(t("nlpPdfStatusFailed"));
      setPdfError(t(errorKey));
      return;
    }

    setPdfScanning(true);
    setPdfScanStatus(t("nlpPdfScanning"));
    setPdfError("");
    setPdfSuccessVisible(false);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/api/nlp/analyze-pdf`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPdfScanStatus(t("nlpPdfStatusSuccess"));
        setPdfSuccessVisible(true);
        applyResult(data);
        void refreshAnalytics();
      } else {
        setPdfScanStatus(t("nlpPdfStatusFailed"));
        setPdfError(pdfApiErrorMessage(res.status, data.message, t));
      }
    } catch {
      setPdfScanStatus(t("nlpPdfStatusFailed"));
      setPdfError(t("nlpErrPdfNetwork"));
    } finally {
      setPdfScanning(false);
    }
  };

  const handleDownloadWordTemplate = async () => {
    setTemplateDownloadError("");
    try {
      const res = await fetch(`${API_BASE}/api/nlp/template`);
      if (!res.ok) {
        setTemplateDownloadError(t("nlpErrWordTemplate"));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "emergency_blood_request_template.docx";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setTemplateDownloadError(t("nlpErrWordTemplate"));
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
    setHospitalName("");
    setCity("");
    setContactNumber("");
    setDonorType("");
    setPatientCondition("");
    setTimeNeeded("");
    setRequestType("");
    setConfidence("");
    setSource("");
    setExtractedKeywords([]);
    setSelectedPdfName("");
    setPdfScanStatus("");
    setPdfError("");
    setPdfSuccessVisible(false);
    setTemplateDownloadError("");
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const handleCreateUrgentRequest = () => {
    if (!VALID_BLOOD_TYPES.includes(bloodType)) return;

    const urgencyPart = urgency
      ? `${t("nlpUrgencyComposedPrefix")} ${translateUrgencyForDisplay(urgency, t)}`
      : "";

    const parts = [
      location,
      urgencyPart,
      message ? message.slice(0, 200) : "",
    ].filter(Boolean);

    const composed = parts.join(". ") || input.trim().slice(0, 200);

    navigate("/urgent", {
      state: {
        nlpPrefill: {
          bloodType,
          quantity: quantity ? parseInt(quantity, 10) || 1 : 1,
          message: composed,
          location,
          urgency,
          sentiment,
        },
      },
    });
  };

  const canCreateRequest = VALID_BLOOD_TYPES.includes(bloodType);
  const badgeVariant = urgencyBadgeVariant(urgency);
  const localeTag = language === "AR" ? "ar" : "en";

  const hospitalTooltipLabel = (label) =>
    String(t("nlpHospitalWithName")).replace("{{name}}", label);

  const sourceLabel =
    source === "pdf" ? t("nlpSourcePdf") : source === "text" ? t("nlpSourceText") : "";
  const confidenceLabel = formatConfidencePercent(confidence);

  return (
    <div
      className="nlp-page"
      dir={language === "AR" ? "rtl" : "ltr"}
      lang={language === "AR" ? "ar" : "en"}
    >
      <div className="container py-5">
        <div className="row align-items-start g-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">{t("nlpAnalyzerPageTitle")}</h2>
            <p className="mb-4">{t("nlpPageIntroShort")}</p>

            <div className="p-4 rounded shadow-sm border bg-white analytics-card">
              <h6 className="fw-semibold mb-3">{t("nlpStep1")}</h6>
              <textarea
                className="form-control mb-3"
                rows={5}
                placeholder={t("nlpPlaceholder")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {error && (
                <p className="small text-warning mb-2">{error}</p>
              )}
              <button
                type="button"
                className="btn btn-danger w-100 mb-0"
                onClick={analyzeText}
                disabled={analyzing || pdfScanning || !input.trim()}
              >
                {analyzing ? t("nlpAnalyzingDots") : t("nlpAnalyze")}
              </button>
              <hr className="my-2 border-secondary opacity-25" />
              <p id="nlp-word-template-hint" className="small text-muted mb-2">
                {t("nlpDownloadWordTemplateHint")}
              </p>
              <button
                type="button"
                className="btn btn-primary w-100 mb-2 fw-semibold shadow-sm"
                onClick={handleDownloadWordTemplate}
                aria-describedby="nlp-word-template-hint"
              >
                {t("nlpDownloadWordTemplate")}
              </button>
              {templateDownloadError && (
                <p className="small text-danger mb-2">{templateDownloadError}</p>
              )}
              <hr className="my-3" />
              <h6 className="fw-semibold mb-2">{t("nlpPdfSectionTitle")}</h6>
              <p className="small text-muted mb-2">{t("nlpPdfHint")}</p>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="form-control mb-2"
                onChange={handlePdfFileChange}
                disabled={analyzing || pdfScanning}
              />
              <p className="small mb-1">
                <span className="text-muted">{t("nlpPdfSelectedFileLabel")}</span>{" "}
                <span className="fw-medium">
                  {selectedPdfName || "—"}
                </span>
              </p>
              <p className="small mb-2">
                <span className="text-muted">{t("nlpPdfStatusLabel")}</span>{" "}
                <span className="fw-medium">{pdfScanStatus || "—"}</span>
              </p>
              {pdfSuccessVisible && (
                <p className="small text-success mb-2">{t("nlpPdfScanSuccessNote")}</p>
              )}
              {pdfError && (
                <p className="small text-danger mb-2">{pdfError}</p>
              )}
              <button
                type="button"
                className="btn btn-outline-danger w-100 mb-2"
                onClick={handlePdfScan}
                disabled={pdfScanning || analyzing || !selectedPdfName}
              >
                {pdfScanning ? t("nlpPdfScanning") : t("nlpPdfScanButton")}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={clearAll}
              >
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

            <div className="p-4 rounded shadow-sm border bg-white mb-4 analytics-card">
              <h6 className="fw-semibold mb-3">{t("nlpStep2")}</h6>
              <div className="d-flex justify-content-between pb-2 border-bottom">
                <span>{t("nlpBloodType")}</span>
                <strong>{bloodType || t("nlpNotDetected")}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>{t("nlpQuantity")}</span>
                <strong>{quantity !== "" ? quantity : "1"}</strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>{t("nlpLocation")}</span>
                <strong className="text-end ms-2">
                  {location || t("nlpNotDetected")}
                </strong>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span>{t("nlpUrgency")}</span>
                <span className={`badge bg-${badgeVariant}`}>
                  {urgency
                    ? translateUrgencyForDisplay(urgency, t)
                    : t("nlpNotDetected")}
                </span>
              </div>

              <hr className="my-3" />
              <h6 className="fw-semibold mb-2 text-secondary small">
                {t("nlpExtendedEntities")}
              </h6>
              <NlpDetailRow label={t("nlpHospitalName")} value={hospitalName} t={t} />
              <NlpDetailRow label={t("nlpCity")} value={city} t={t} />
              <NlpDetailRow label={t("nlpContactNumber")} value={contactNumber} t={t} />
              <NlpDetailRow label={t("nlpDonorType")} value={donorType} t={t} />
              <NlpDetailRow label={t("nlpPatientCondition")} value={patientCondition} t={t} />
              <NlpDetailRow label={t("nlpTimeNeeded")} value={timeNeeded} t={t} />
              <NlpDetailRow label={t("nlpRequestType")} value={requestType} t={t} />
              <NlpDetailRow
                label={t("nlpConfidence")}
                value={confidenceLabel || ""}
                t={t}
              />
              <NlpDetailRow label={t("nlpSource")} value={sourceLabel} t={t} />
              <div className="pt-2 pb-1 border-bottom">
                <small className="text-muted d-block mb-2">{t("nlpExtractedKeywords")}</small>
                {extractedKeywords.length ? (
                  <div className="d-flex flex-wrap gap-1">
                    {extractedKeywords.map((k) => (
                      <span key={k} className="badge rounded-pill bg-light text-dark border">
                        {k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="small text-muted">{t("nlpNotDetected")}</span>
                )}
              </div>
            </div>

            {canCreateRequest && (
              <button
                type="button"
                className="btn btn-danger w-100"
                onClick={handleCreateUrgentRequest}
              >
                {t("nlpCreateUrgent")}
              </button>
            )}
          </div>
        </div>

        <div className="row mt-5 g-4">
          <h4 className="fw-bold mb-3 text-danger">
            {t("nlpAnalyticsOverview")}
          </h4>

          <div className="col-lg-3">
            <div className="border rounded shadow-sm p-3 h-100 bg-white analytics-card">
              <h6 className="fw-semibold text-center mb-3">
                {t("nlpAnalyticsByBloodType")}
              </h6>
              <ResponsiveContainer width="100%" height={250}>
                {derivedCharts.pieData.length > 0 ? (
                  <PieChart>
                    <Pie
                      data={derivedCharts.pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      label={({ value }) => (value > 0 ? value : "")}
                    >
                      {derivedCharts.pieData.map((entry, index) => (
                        <Cell
                          key={`${entry.name}-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted small px-2 text-center">
                    {t("nlpAnalyticsChartEmpty")}
                  </div>
                )}
              </ResponsiveContainer>
              <small className="text-muted text-center d-block">
                {analytics.totalRequests}{" "}
                {t("nlpAnalyticsRequestCountSuffix")}
              </small>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="border rounded shadow-sm p-3 h-100 bg-white analytics-card">
              <h6 className="fw-semibold text-center mb-3">
                {t("nlpAnalyticsByHospital")}
              </h6>
              <ResponsiveContainer width="100%" height={250}>
                {derivedCharts.barData.length > 0 ? (
                  <BarChart data={derivedCharts.barData}>
                    <XAxis hide dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${value} ${t("nlpAnalyticsRequestCountSuffix")}`,
                        t("nlpTooltipTotalSeries"),
                      ]}
                      labelFormatter={(label) =>
                        hospitalTooltipLabel(
                          label !== undefined &&
                            label !== null &&
                            String(label).trim() !== ""
                            ? label
                            : t("nlpNotDetected")
                        )
                      }
                    />
                    <Bar
                      dataKey="value"
                      fill="#dc3545"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 text-muted small px-2 text-center">
                    {t("nlpAnalyticsChartEmpty")}
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="border rounded shadow-sm p-4 h-100 bg-white analytics-card">
              <h6 className="fw-semibold mb-4 text-center">
                {t("nlpAnalyticsMostRequestedBlood")}
              </h6>
              {derivedCharts.topBloodTypesRanked.map((item, index) => (
                <div key={item.name} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small>{item.name}</small>
                    <small>{item.value}</small>
                  </div>
                  <div className="progress" style={{ height: 10 }}>
                    <div
                      className={`progress-bar ${
                        PROGRESS_BAR_CLASSES[
                          Math.min(index, PROGRESS_BAR_CLASSES.length - 1)
                        ]
                      }`}
                      style={{
                        width: `${Math.min(item.value * 15, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-3">
            <div className="border rounded shadow-sm p-4 h-100 bg-white analytics-card">
              <h6 className="fw-semibold mb-4 text-center">
                {t("nlpAnalyticsSmartSummary")}
              </h6>
              <StatRow
                dotClass="bg-danger"
                label={t("nlpStatTotalRequests")}
                value={analytics.totalRequests}
                large
              />
              <StatRow
                dotClass="bg-primary"
                label={t("nlpStatMostRequestedBlood")}
                value={derivedCharts.topBloodName}
              />
              <StatRow
                dotClass="bg-success"
                label={t("nlpStatActiveHospitals")}
                value={analytics.locationData.length}
              />
              <StatRow
                dotClass="bg-warning"
                label={t("nlpStatTopHospital")}
                value={derivedCharts.topHospitalName}
              />
              <StatRow
                dotClass="bg-dark"
                label={t("nlpStatRarestType")}
                value={derivedCharts.rarestBloodName}
                last
              />
              <small className="text-muted d-block mt-4">
                {t("nlpLastUpdatedPrefix")}{" "}
                {new Date().toLocaleDateString(localeTag)}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLPAssistant;
