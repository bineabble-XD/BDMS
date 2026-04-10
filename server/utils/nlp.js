/**
 * NLP utilities for BDMS — extraction + sentiment (no external ML dependency)
 */

/** Match longer codes first so "AB+" is not mistaken for "A+" */
const BLOOD_TYPE_CODES = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

const HIGH_URGENCY = [
  "urgent",
  "immediately",
  "emergency",
  "emergencies",
  "critical",
  "life-threatening",
  "life threatening",
  "within hours",
  "tonight",
  "asap",
  "stat",
  "code",
  "as soon as",
  "أزمة",
  "طارئ",
  "طوارئ",
];
const MEDIUM_URGENCY = ["soon", "needed soon", "preferably", "would like", "when possible", "قريباً"];

/** Oman places often mentioned without the word "hospital" */
const OMAN_PLACES = [
  "muscat",
  "salalah",
  "nizwa",
  "sohar",
  "sur",
  "ibri",
  "rustaq",
  "al rustaq",
  "barka",
  "amerat",
  "seeb",
  "al seeb",
  "bawshar",
  "muttrah",
  "matrah",
  "qurum",
  "ghala",
  "al khoud",
  "duqm",
];

/** Natural language → canonical code */
const BLOOD_ALIASES = [
  { pattern: /\b(?:type\s+)?o\s*[-–]?\s*negative\b|\bo\s*neg\b|\b0\s*negative\b/i, code: "O-" },
  { pattern: /\b(?:type\s+)?o\s*[-–]?\s*positive\b|\bo\s*pos\b|\b0\s*positive\b/i, code: "O+" },
  { pattern: /\b(?:type\s+)?a\s*[-–]?\s*negative\b|\ba\s*neg\b/i, code: "A-" },
  { pattern: /\b(?:type\s+)?a\s*[-–]?\s*positive\b|\ba\s*pos\b/i, code: "A+" },
  { pattern: /\b(?:type\s+)?b\s*[-–]?\s*negative\b|\bb\s*neg\b/i, code: "B-" },
  { pattern: /\b(?:type\s+)?b\s*[-–]?\s*positive\b|\bb\s*pos\b/i, code: "B+" },
  { pattern: /\b(?:type\s+)?ab\s*[-–]?\s*negative\b|\bab\s*neg\b/i, code: "AB-" },
  { pattern: /\b(?:type\s+)?ab\s*[-–]?\s*positive\b|\bab\s*pos\b/i, code: "AB+" },
];

function detectBloodType(lower, original) {
  for (const { pattern, code } of BLOOD_ALIASES) {
    if (pattern.test(original) || pattern.test(lower)) return code;
  }
  const sortedCodes = [...BLOOD_TYPE_CODES].sort(
    (a, b) => b.replace(/\W/g, "").length - a.replace(/\W/g, "").length
  );
  for (const code of sortedCodes) {
    const sub = code.toLowerCase();
    if (lower.includes(sub)) return code;
  }
  return "";
}

function detectLocation(lower, original) {
  const hospitalMatch = original.match(
    /([a-zA-Z\u0600-\u06FF]+(?:\s+[a-zA-Z\u0600-\u06FF]+)*)\s*(?:hospital|مستشفى|medical\s*cent(?:er|re))/i
  );
  if (hospitalMatch) {
    return hospitalMatch[0].replace(/\b\w/g, (c) => c.toUpperCase());
  }

  for (const place of OMAN_PLACES) {
    const re = new RegExp(`(?:^|[\\s,])(?:in|at|near|inside)\\s+(${place.replace(/\s+/g, "\\s+")})\\b`, "i");
    const m = lower.match(re);
    if (m) {
      return m[1].replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (lower.includes(place)) {
      return place
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }

  return "";
}

function detectUrgency(lower) {
  if (HIGH_URGENCY.some((w) => lower.includes(w))) return "High";
  if (MEDIUM_URGENCY.some((w) => lower.includes(w))) return "Medium";
  return "Low";
}

function detectQuantity(lower) {
  const qtyMatch =
    lower.match(/(\d+)\s*(?:units?|bags?|pints?|donations?|bottles?)/i) ||
    lower.match(/(?:need|require|want|needed|seeking)\s+(\d+)/i) ||
    lower.match(/\b(\d+)\s*(?:of|for)\s*(?:blood|units?)/i) ||
    lower.match(/(?:give|send|deliver)\s+(\d+)/i);
  return qtyMatch ? Math.max(1, parseInt(qtyMatch[1], 10)) : 1;
}

export function extractFromText(text) {
  if (!text || typeof text !== "string") {
    return {
      bloodType: "",
      quantity: 1,
      location: "",
      urgency: "Low",
      message: "",
      hints: [],
    };
  }

  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const bloodType = detectBloodType(lower, trimmed);
  const location = detectLocation(lower, trimmed);
  const urgency = detectUrgency(lower);
  const quantity = detectQuantity(lower);

  const hints = [];
  if (bloodType) hints.push("blood_type");
  if (location) hints.push("location");
  if (urgency !== "Low") hints.push("urgency");
  if (quantity > 1) hints.push("quantity");

  return {
    bloodType,
    quantity,
    location,
    urgency,
    message: trimmed.slice(0, 500),
    hints,
  };
}

const POSITIVE_WORDS = [
  "good",
  "great",
  "excellent",
  "amazing",
  "wonderful",
  "helpful",
  "easy",
  "fast",
  "smooth",
  "love",
  "thank",
  "thanks",
  "appreciate",
  "recommend",
  "happy",
  "satisfied",
  "pleased",
  "perfect",
  "fantastic",
  "outstanding",
];
const NEGATIVE_WORDS = [
  "bad",
  "poor",
  "terrible",
  "awful",
  "slow",
  "difficult",
  "confusing",
  "frustrated",
  "disappointed",
  "hate",
  "worst",
  "broken",
  "error",
  "issue",
  "problem",
  "unhappy",
  "dissatisfied",
  "annoying",
  "useless",
  "waste",
];

export function analyzeSentiment(text) {
  if (!text || typeof text !== "string") {
    return { sentiment: "neutral", score: 0, label: "Neutral" };
  }

  const words = text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  let raw = 0;

  for (const w of words) {
    if (POSITIVE_WORDS.some((p) => w === p || w.includes(p) || p.includes(w))) raw += 1;
    if (NEGATIVE_WORDS.some((n) => w === n || w.includes(n) || n.includes(w))) raw -= 1;
  }

  const normalized = Math.max(-1, Math.min(1, raw / Math.max(1, words.length)));
  let sentiment = "neutral";
  let label = "Neutral";
  if (normalized > 0.08) {
    sentiment = "positive";
    label = "Positive";
  } else if (normalized < -0.08) {
    sentiment = "negative";
    label = "Negative";
  }

  return { sentiment, score: normalized, label, rawScore: raw, wordCount: words.length };
}

/** Single call for API: extraction + sentiment + lightweight intent */
export function analyzeFull(text) {
  const extraction = extractFromText(text);
  const sentiment = analyzeSentiment(text);
  const intent =
    extraction.bloodType || extraction.urgency === "High"
      ? "urgent_blood_request"
      : extraction.message.length > 10
        ? "general"
        : "empty";

  return {
    ...extraction,
    sentiment,
    intent,
  };
}
