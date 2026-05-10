/**
 * NLP utilities for BDMS — rule-based extraction + request sentiment (no external ML)
 */

/** Match longer codes first so "AB+" is not mistaken for "A+" */
const BLOOD_TYPE_CODES = ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];

const MAX_LOCATION_LENGTH = 80;
const MAX_LOCATION_WORDS = 12;

const HIGH_URGENCY = [
  "urgent",
  "urgently",
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
const MEDIUM_URGENCY = [
  "soon",
  "needed soon",
  "preferably",
  "would like",
  "when possible",
  "قريباً",
  "looking for",
  "searching for",
  "seeking",
  "in need of",
  "trying to find",
];

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

function titleCaseSegment(s) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function detectBloodType(lower, original) {
  for (const { pattern, code } of BLOOD_ALIASES) {
    if (pattern.test(original) || pattern.test(lower)) return code;
  }
  const sortedCodes = [...BLOOD_TYPE_CODES].sort(
    (a, b) => b.replace(/\W/g, "").length - a.replace(/\W/g, "").length
  );
  for (const code of sortedCodes) {
    const esc = code.replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
    const re = new RegExp(`(?:^|[^a-z0-9+])${esc}(?![a-z0-9-])`, "i");
    if (re.test(original)) return code;
  }
  return "";
}

/** "at Royal Hospital Muscat" → Royal Hospital Muscat */
function detectHospitalPhrase(original, lower) {
  const withPrep = original.match(
    /\b(?:at|in|near|inside|from|to)\s+((?:[a-zA-Z\u0600-\u06FF]+\s+)*hospital(?:\s+[a-zA-Z\u0600-\u06FF]+)*)\b/i
  );
  if (withPrep?.[1]) return titleCaseSegment(withPrep[1].trim());

  const bare = original.match(
    /\b((?:[a-zA-Z\u0600-\u06FF]+\s+)+hospital(?:\s+[a-zA-Z\u0600-\u06FF]+)*)\b/i
  );
  if (bare?.[1]) {
    const phrase = bare[1].trim();
    if (/^blood\s+/i.test(phrase)) return "";
    return titleCaseSegment(phrase);
  }

  const med = original.match(
    /\b(?:at|in|near|inside)\s+((?:[a-zA-Z\u0600-\u06FF]+\s+)*medical\s+cent(?:er|re)(?:\s+[a-zA-Z\u0600-\u06FF]+)*)\b/i
  );
  if (med?.[1]) return titleCaseSegment(med[1].trim());

  return "";
}

function detectPlaceName(lower, original) {
  for (const place of OMAN_PLACES) {
    const placeRe = place.replace(/\s+/g, "\\s+");
    const withPrep = new RegExp(
      `(?:^|[\\s,])(?:in|at|near|inside)\\s+(${placeRe})\\b`,
      "i"
    );
    const m1 = lower.match(withPrep);
    if (m1) return titleCaseSegment(m1[1]);

    const boundary = new RegExp(`(?:^|[\\s,])(${placeRe})(?:$|[\\s,.])`, "i");
    const m2 = lower.match(boundary);
    if (m2) return titleCaseSegment(m2[1]);
  }
  return "";
}

/**
 * Drop locations that look like pasted paragraphs or noise.
 * @param {string} loc
 * @returns {string}
 */
export function validateExtractedLocation(loc) {
  if (!loc || typeof loc !== "string") return "";
  const t = loc.trim().replace(/\s+/g, " ");
  if (!t) return "";
  if (t.length > MAX_LOCATION_LENGTH) return "";
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length > MAX_LOCATION_WORDS) return "";
  if (/\n/.test(loc)) return "";
  const sentenceChunks = t.split(/[.!?]+/).filter((s) => s.trim().length > 3);
  if (sentenceChunks.length > 1) return "";
  if (words.some((w) => w.length > 22)) return "";
  if ((t.match(/,/g) || []).length > 2) return "";
  if (/^(the|a|an)\s+(blood|donation|system|web|application|management)\b/i.test(t)) return "";
  return t;
}

function detectLocation(lower, original, bloodType) {
  const gated = (candidate) => {
    const v = validateExtractedLocation(candidate);
    if (!v) return "";
    const idx = original.toLowerCase().indexOf(v.toLowerCase());
    if (idx <= 0) return v;
    const preamble = original.slice(0, idx).trim();
    if (preamble.length > 100 && !bloodType) return "";
    return v;
  };

  const hospital = detectHospitalPhrase(original, lower);
  if (hospital) return gated(hospital);

  const place = detectPlaceName(lower, original);
  return gated(place);
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

/** Urgency-aligned sentiment for blood-request assistant */
function buildRequestSentiment(urgency) {
  if (urgency === "High") return { label: "urgent", score: 0.9 };
  if (urgency === "Medium") return { label: "attentive", score: 0.55 };
  return { label: "calm", score: 0.25 };
}

const MAX_MESSAGE_LEN = 4000;

/**
 * Normalize raw text (e.g. from PDF) before extraction.
 * @param {string} raw
 * @returns {string}
 */
export function cleanTextForNlp(raw) {
  if (raw == null) return "";
  const s = String(raw);
  return s
    .replace(/\u0000/g, "")
    .replace(/[\u00AD]/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Full NLP result for blood-request assistant (text or PDF-derived text).
 * @param {string} text
 */
export function analyzeBloodRequest(text) {
  const cleaned = cleanTextForNlp(text);
  const extraction = extractFromText(cleaned);
  const sentiment = buildRequestSentiment(extraction.urgency);
  return {
    bloodType: extraction.bloodType,
    location: extraction.location,
    urgency: extraction.urgency,
    quantity: extraction.quantity,
    message: extraction.message,
    sentiment,
  };
}

export function extractFromText(text) {
  if (!text || typeof text !== "string") {
    return {
      bloodType: "",
      quantity: 1,
      location: "",
      urgency: "Low",
      message: "",
    };
  }

  const trimmed = text.trim().slice(0, MAX_MESSAGE_LEN);
  const lower = trimmed.toLowerCase();
  const bloodType = detectBloodType(lower, trimmed);
  const location = detectLocation(lower, trimmed, bloodType);
  const urgency = detectUrgency(lower);
  const quantity = detectQuantity(lower);

  return {
    bloodType,
    quantity,
    location,
    urgency,
    message: trimmed,
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

/** Feedback-style polarity (legacy / other routes) */
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

/** @deprecated Use analyzeBloodRequest */
export function analyzeFull(text) {
  return analyzeBloodRequest(text);
}
