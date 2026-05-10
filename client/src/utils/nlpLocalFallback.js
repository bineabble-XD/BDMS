/**
 * Offline / error fallback — subset aligned with server analyzeBloodRequest (rule-based).
 */
const CODES = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

function urgencyToSentiment(urgency) {
  if (urgency === "High") return { label: "urgent", score: 0.85 };
  if (urgency === "Medium") return { label: "attentive", score: 0.52 };
  return { label: "calm", score: 0.22 };
}

export function extractNlpLocal(text) {
  if (!text || typeof text !== "string") {
    return {
      bloodType: "",
      quantity: 1,
      location: "",
      hospitalName: "",
      city: "",
      contactNumber: "",
      donorType: "",
      patientCondition: "",
      timeNeeded: "",
      requestType: "",
      extractedKeywords: [],
      confidence: 0,
      source: "text",
      urgency: "Low",
      message: "",
      sentiment: urgencyToSentiment("Low"),
      intent: "empty",
      hints: [],
    };
  }
  const lower = text.toLowerCase();
  let bloodType = "";
  for (const c of CODES) {
    if (lower.includes(c.toLowerCase())) {
      bloodType = c;
      break;
    }
  }
  const high = ["urgent", "emergency", "critical", "asap", "tonight"].some((w) => lower.includes(w));
  const med = ["soon", "preferably"].some((w) => lower.includes(w));
  const urgency = high ? "High" : med ? "Medium" : "Low";
  const qtyMatch =
    lower.match(/(\d+)\s*(?:units?|bags?)/i) || lower.match(/(?:need|want)\s+(\d+)/i);
  const quantity = qtyMatch ? Math.max(1, parseInt(qtyMatch[1], 10)) : 1;
  const hosp = text.match(/([a-zA-Z\s]+)\s*(?:hospital|medical)/i);
  const locationRaw = hosp ? hosp[0].replace(/\b\w/g, (x) => x.toUpperCase()) : "";
  const location =
    locationRaw && !/\bfor\s+/i.test(locationRaw)
      ? locationRaw
      : locationRaw.split(/\bfor\s+/i)[0]?.trim() || locationRaw;

  const kw = [];
  if (bloodType) kw.push(bloodType);
  if (urgency === "High") kw.push("urgent");

  return {
    bloodType,
    quantity,
    location,
    hospitalName: "",
    city: "",
    contactNumber: "",
    donorType: "",
    patientCondition: "",
    timeNeeded: "",
    requestType: bloodType ? "Blood Request" : "",
    extractedKeywords: kw,
    confidence: bloodType ? 0.35 : 0.15,
    source: "text",
    urgency,
    message: text.trim().slice(0, 500),
    sentiment: urgencyToSentiment(urgency),
    intent: bloodType ? "urgent_blood_request" : "general",
    hints: [],
  };
}
