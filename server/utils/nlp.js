/**
 * NLP utilities for BDMS - extraction and sentiment analysis
 */

const BLOOD_TYPES = ["a+", "a-", "b+", "b-", "o+", "o-", "ab+", "ab-"];
const HIGH_URGENCY = [
  "urgent", "immediately", "emergency", "critical", "life-threatening",
  "life threatening", "within hours", "tonight", "asap", "stat", "code"
];
const MEDIUM_URGENCY = ["soon", "needed soon", "preferably", "would like"];

export function extractFromText(text) {
  if (!text || typeof text !== "string") {
    return { bloodType: "", quantity: 1, location: "", urgency: "Low", message: "" };
  }

  const lower = text.toLowerCase().trim();

  const bloodType = BLOOD_TYPES.find((bt) => lower.includes(bt));
  const detectedBloodType = bloodType ? bloodType.toUpperCase() : "";

  const hospitalMatch = lower.match(/([a-zA-Z\u0600-\u06FF]+(?:\s+[a-zA-Z\u0600-\u06FF]+)*)\s*(?:hospital|مستشفى)/i);
  const location = hospitalMatch
    ? hospitalMatch[0].replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  let urgency = "Low";
  if (HIGH_URGENCY.some((w) => lower.includes(w))) urgency = "High";
  else if (MEDIUM_URGENCY.some((w) => lower.includes(w))) urgency = "Medium";

  const qtyMatch =
    lower.match(/(\d+)\s*(?:units?|bags?|pints?|donations?)/i) ||
    lower.match(/(?:need|require|want|needed)\s+(\d+)/i) ||
    lower.match(/\b(\d+)\s*(?:of|for)\s*(?:blood|units?)/i);
  const quantity = qtyMatch ? Math.max(1, parseInt(qtyMatch[1], 10)) : 1;

  return {
    bloodType: detectedBloodType,
    quantity,
    location,
    urgency,
    message: text.trim().slice(0, 200),
  };
}

/**
 * Simple sentiment analysis using word lists (no external NLP lib required)
 * Returns: { sentiment: "positive"|"negative"|"neutral", score: -1 to 1 }
 */
const POSITIVE_WORDS = [
  "good", "great", "excellent", "amazing", "wonderful", "helpful", "easy",
  "fast", "smooth", "love", "thank", "thanks", "appreciate", "recommend",
  "happy", "satisfied", "pleased", "perfect", "fantastic", "outstanding"
];
const NEGATIVE_WORDS = [
  "bad", "poor", "terrible", "awful", "slow", "difficult", "confusing",
  "frustrated", "disappointed", "hate", "worst", "broken", "error", "issue",
  "problem", "unhappy", "dissatisfied", "annoying", "useless", "waste"
];

export function analyzeSentiment(text) {
  if (!text || typeof text !== "string") {
    return { sentiment: "neutral", score: 0, label: "Neutral" };
  }

  const words = text.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  let score = 0;

  for (const w of words) {
    if (POSITIVE_WORDS.some((p) => w.includes(p) || p.includes(w))) score += 1;
    if (NEGATIVE_WORDS.some((n) => w.includes(n) || n.includes(w))) score -= 1;
  }

  const normalized = Math.max(-1, Math.min(1, score / Math.max(1, words.length)));
  let sentiment = "neutral";
  let label = "Neutral";
  if (normalized > 0.1) {
    sentiment = "positive";
    label = "Positive";
  } else if (normalized < -0.1) {
    sentiment = "negative";
    label = "Negative";
  }

  return { sentiment, score: normalized, label };
}
