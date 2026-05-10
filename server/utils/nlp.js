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

const PATIENT_CONDITION_RULES = [
  { value: "Accident", patterns: [/\baccident\b/i, /\bcrash\b/i, /\bcollision\b/i] },
  { value: "Surgery", patterns: [/\bsurger[yies]\b/i, /\bsurgical\b/i, /\boperation\b/i] },
  { value: "Cancer", patterns: [/\bcancer\b/i, /\boncolog/i, /\bchemo\b/i] },
  { value: "Emergency", patterns: [/\bemergency\b/i, /\btrauma\b/i, /\ber\s+admission\b/i] },
  { value: "Delivery", patterns: [/\bdeliver(y|ies)\b/i, /\blabou?r\b/i, /\bbirth\b/i, /\bpostpartum\b/i] },
  { value: "ICU", patterns: [/\bicu\b/i, /\bintensive\s+care\b/i] },
];

const DONOR_TYPE_RULES = [
  { value: "Platelets", patterns: [/\bplatelet[s]?\b/i, /\bapheresis\b/i] },
  { value: "Plasma", patterns: [/\bplasma\b/i] },
  { value: "Whole Blood", patterns: [/\bwhole\s*blood\b/i, /\bwhole-blood\b/i, /\bwb\b(?![a-z])/i] },
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

/** Stop location at subordinate clause starters (common in medical requests). */
function trimLocationTrailingPhrases(s) {
  if (!s) return "";
  let best = s.trim();
  let minIdx = best.length;
  const patterns = [
    /\s+\bfor\s+/i,
    /\s+\bwith\s+(?:the\s+)?patient\b/i,
    /\s+\bdue\s+to\s+/i,
    /\s+\bbecause\s+/i,
    /\s+\bafter\s+/i,
  ];
  for (const re of patterns) {
    const m = re.exec(best);
    if (m && m.index >= 0 && m.index < minIdx) minIdx = m.index;
  }
  if (minIdx < best.length) best = best.slice(0, minIdx).trim();
  return best;
}

function detectHospitalPhrase(original, lower) {
  const withPrep = original.match(
    /\b(?:at|in|near|inside|from|to)\s+((?:[a-zA-Z\u0600-\u06FF]+\s+)*hospital(?:\s+[a-zA-Z\u0600-\u06FF]+)*)\b/i
  );
  if (withPrep?.[1])
    return titleCaseSegment(trimLocationTrailingPhrases(withPrep[1].trim()));

  const bare = original.match(
    /\b((?:[a-zA-Z\u0600-\u06FF]+\s+)+hospital(?:\s+[a-zA-Z\u0600-\u06FF]+)*)\b/i
  );
  if (bare?.[1]) {
    const phrase = trimLocationTrailingPhrases(bare[1].trim());
    if (/^blood\s+/i.test(phrase)) return "";
    return titleCaseSegment(phrase);
  }

  const med = original.match(
    /\b(?:at|in|near|inside)\s+((?:[a-zA-Z\u0600-\u06FF]+\s+)*medical\s+cent(?:er|re)(?:\s+[a-zA-Z\u0600-\u06FF]+)*)\b/i
  );
  if (med?.[1]) return titleCaseSegment(trimLocationTrailingPhrases(med[1].trim()));

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

/**
 * hospitalName = facility with "Hospital" (or medical centre); city = trailing place if valid.
 */
function deriveHospitalNameAndCity(location) {
  if (!location) return { hospitalName: "", city: "" };

  const hm = location.match(/^(.+?\s[Hh]ospital)(?:\s+(.+))?$/);
  if (hm) {
    const hospitalPart = titleCaseSegment(hm[1].trim());
    const rest = (hm[2] || "").trim();
    if (rest) {
      const cityCandidate = titleCaseSegment(rest);
      if (validateExtractedLocation(cityCandidate) && cityCandidate.split(/\s+/).length <= 4) {
        return { hospitalName: hospitalPart, city: cityCandidate };
      }
    }
    return { hospitalName: hospitalPart, city: "" };
  }

  if (!/\bhospital\b/i.test(location) && !/\bmedical\s+cent(?:er|re)\b/i.test(location)) {
    return { hospitalName: "", city: location };
  }

  return { hospitalName: titleCaseSegment(location), city: "" };
}

function normalizePhone(raw) {
  if (!raw) return "";
  let s = String(raw).replace(/[^\d+]/g, "").trim();
  if (s.startsWith("968") && !s.startsWith("+")) s = `+${s}`;
  else if (/^\d{8}$/.test(s)) s = `+968${s}`;
  else if (s.length >= 10 && !s.startsWith("+")) s = `+${s}`;
  return s.slice(0, 20);
}

function detectContactNumber(text) {
  const labeled = text.match(
    /\b(?:contact|phone|tel|mobile|whatsapp|call)\s*[:\s]+(\+?\d[\d\s().-]{6,18}\d)/i
  );
  if (labeled?.[1]) return normalizePhone(labeled[1]);

  const intl = text.match(/\B(\+\d{1,3}[\s.-]?\d{6,14}\d)\b/) || text.match(/\b(\+\d{10,16})\b/);
  if (intl?.[1]) return normalizePhone(intl[1]);

  const oman = text.match(/\+968[\s.-]?(\d{8})\b/) || text.match(/\b968[\s.-]?(\d{8})\b/);
  if (oman) return normalizePhone(`968${oman[1]}`);

  const us = text.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/);
  if (us) return normalizePhone(us[0]);

  return "";
}

function detectDonorType(lower) {
  for (const { value, patterns } of DONOR_TYPE_RULES) {
    if (patterns.some((p) => p.test(lower))) return value;
  }
  return "";
}

function detectPatientCondition(lower) {
  const originalLower = lower;
  for (const { value, patterns } of PATIENT_CONDITION_RULES) {
    for (const p of patterns) {
      if (p.test(originalLower)) {
        if (value === "Emergency" && /\baccident\b/.test(lower)) continue;
        return value;
      }
    }
  }
  if (/\baccident\b/.test(lower)) return "Accident";
  return "";
}

function detectTimeNeeded(lower) {
  if (/\bimmediately\b|\bright\s+now\b|\bat\s+once\b|\bnow\b(?!\w)/i.test(lower)) return "Immediately";
  const withinH = lower.match(/\bwithin\s+(\d+)\s*(?:hour|hr)s?\b/i);
  if (withinH) return `Within ${withinH[1]} hours`;
  if (/\bwithin\s+(?:a\s+)?few\s+hours\b/i.test(lower)) return "Within a few hours";
  if (/\btoday\b/i.test(lower)) return "Today";
  if (/\btomorrow\s+morning\b/i.test(lower)) return "Tomorrow morning";
  if (/\btomorrow\b/i.test(lower)) return "Tomorrow";
  return "";
}

function detectRequestType(lower, bloodType) {
  const donation =
    /\b(?:i\s+)?(?:want|would like|wish)\s+to\s+donate\b/i.test(lower) ||
    /\bdonate\s+(?:blood|plasma|platelet)/i.test(lower) ||
    /\bblood\s+donation\b/i.test(lower) ||
    /\bvolunteer\s+(?:as\s+)?(?:a\s+)?donor\b/i.test(lower) ||
    /\b(?:available\s+to\s+)?donate\b/i.test(lower);

  const request =
    /\bneed\b|\brequest\b|\bpatient\b|\burgent\s+need\b|\bshortage\b|\brequire\b|\bseeking\s+blood\b/i.test(
      lower
    ) ||
    /\bunits?\s+of\b/i.test(lower);

  if (donation && !request) return "Blood Donation";
  if (request) return "Blood Request";
  if (donation) return "Blood Donation";
  if (bloodType && /\b(?:give|send|deliver)\b/i.test(lower)) return "Blood Request";
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

function buildExtractedKeywords(fields, lower) {
  const out = [];
  const add = (s) => {
    if (s && !out.includes(s)) out.push(s);
  };
  if (fields.bloodType) add(fields.bloodType);
  if (fields.location) add(fields.location.split(/\s+/).slice(0, 3).join(" "));
  if (fields.hospitalName) add(fields.hospitalName);
  if (fields.city) add(fields.city);
  if (fields.urgency === "High") add("urgent");
  for (const w of HIGH_URGENCY) {
    if (lower.includes(w) && out.length < 14) add(w);
  }
  if (fields.patientCondition) add(fields.patientCondition.toLowerCase());
  if (fields.donorType) add(fields.donorType.toLowerCase().replace(/\s+/g, "-"));
  if (fields.timeNeeded) add(fields.timeNeeded.toLowerCase().replace(/\s+/g, "-"));
  if (fields.requestType) add(fields.requestType.toLowerCase().replace(/\s+/g, "-"));
  return out.slice(0, 20);
}

function computeConfidence(ex) {
  let c = 0.1;
  if (ex.bloodType) c += 0.2;
  if (ex.quantity > 1) c += 0.03;
  if (ex.location) c += 0.11;
  if (ex.hospitalName) c += 0.09;
  if (ex.city) c += 0.06;
  if (ex.contactNumber) c += 0.08;
  if (ex.donorType) c += 0.05;
  if (ex.patientCondition) c += 0.07;
  if (ex.timeNeeded) c += 0.05;
  if (ex.requestType) c += 0.05;
  if (ex.urgency === "High") c += 0.05;
  else if (ex.urgency === "Medium") c += 0.03;
  return Math.min(0.99, Math.round(c * 100) / 100);
}

function buildRequestSentiment(urgency, confidence) {
  const base =
    urgency === "High"
      ? { label: "urgent", score: 0.9 }
      : urgency === "Medium"
        ? { label: "attentive", score: 0.55 }
        : { label: "calm", score: 0.25 };
  const bump = Math.min(0.05, Math.round((confidence || 0) * 0.04 * 100) / 100);
  return {
    label: base.label,
    score: Math.min(0.99, Math.round((base.score + bump) * 100) / 100),
  };
}

const MAX_MESSAGE_LEN = 4000;

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

export function extractFromText(text) {
  if (!text || typeof text !== "string") {
    return emptyExtraction("");
  }

  const trimmed = text.trim().slice(0, MAX_MESSAGE_LEN);
  const lower = trimmed.toLowerCase();
  const bloodType = detectBloodType(lower, trimmed);
  const location = detectLocation(lower, trimmed, bloodType);
  const { hospitalName, city } = deriveHospitalNameAndCity(location);
  const urgency = detectUrgency(lower);
  const quantity = detectQuantity(lower);
  const contactNumber = detectContactNumber(trimmed);
  const donorType = detectDonorType(lower);
  const patientCondition = detectPatientCondition(lower);
  const timeNeeded = detectTimeNeeded(lower);
  let requestType = detectRequestType(lower, bloodType);
  if (!requestType && (bloodType || location)) {
    requestType = /\bdonat/i.test(lower) ? "Blood Donation" : "Blood Request";
  }

  const extractedKeywords = buildExtractedKeywords(
    {
      bloodType,
      location,
      hospitalName,
      city,
      urgency,
      patientCondition,
      donorType,
      timeNeeded,
      requestType,
      quantity,
    },
    lower
  );

  return {
    bloodType,
    quantity,
    location,
    hospitalName,
    city,
    contactNumber,
    donorType,
    patientCondition,
    timeNeeded,
    requestType,
    extractedKeywords,
    urgency,
    message: trimmed,
  };
}

function emptyExtraction(message) {
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
    urgency: "Low",
    message: message || "",
  };
}

/**
 * @param {string} text
 * @param {"text"|"pdf"} [source]
 */
export function analyzeBloodRequest(text, source = "text") {
  const cleaned = cleanTextForNlp(text);
  const extraction = extractFromText(cleaned);
  const src = source === "pdf" ? "pdf" : "text";
  const confidence = computeConfidence(extraction);
  const sentiment = buildRequestSentiment(extraction.urgency, confidence);
  return {
    bloodType: extraction.bloodType,
    quantity: extraction.quantity,
    location: extraction.location,
    hospitalName: extraction.hospitalName,
    city: extraction.city,
    urgency: extraction.urgency,
    patientCondition: extraction.patientCondition,
    donorType: extraction.donorType,
    timeNeeded: extraction.timeNeeded,
    contactNumber: extraction.contactNumber,
    requestType: extraction.requestType,
    extractedKeywords: extraction.extractedKeywords,
    confidence,
    source: src,
    message: extraction.message,
    sentiment,
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

/** @deprecated Use analyzeBloodRequest */
export function analyzeFull(text) {
  return analyzeBloodRequest(text, "text");
}
