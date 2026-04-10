/**
 * Offline / error fallback — keep logic aligned with server/utils/nlp.js (subset).
 */
/** Longer / more specific codes first (same as server) */
const CODES = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

export function extractNlpLocal(text) {
  if (!text || typeof text !== "string") {
    return {
      bloodType: "",
      quantity: 1,
      location: "",
      urgency: "Low",
      sentiment: { sentiment: "neutral", score: 0, label: "Neutral" },
      intent: "empty",
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
  const location = hosp ? hosp[0].replace(/\b\w/g, (x) => x.toUpperCase()) : "";

  return {
    bloodType,
    quantity,
    location,
    urgency,
    message: text.trim().slice(0, 500),
    sentiment: { sentiment: "neutral", score: 0, label: "Neutral" },
    intent: bloodType ? "urgent_blood_request" : "general",
    hints: [],
  };
}
