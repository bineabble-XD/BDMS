/** In-memory aggregates for POST /api/nlp/analyze (per-process) */

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const bloodTypeCounts = Object.fromEntries(BLOOD_TYPES.map((t) => [t, 0]));
/** @type {Map<string, number>} */
const locationCounts = new Map();
let totalRequests = 0;

function normalizeLocationKey(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * @param {{ bloodType?: string; location?: string }} fields
 */
export function recordNlpAnalyze(fields) {
  totalRequests += 1;
  const bt = fields?.bloodType?.trim();
  if (bt && Object.prototype.hasOwnProperty.call(bloodTypeCounts, bt)) {
    bloodTypeCounts[bt] += 1;
  }
  const loc = normalizeLocationKey(fields?.location);
  if (loc) {
    locationCounts.set(loc, (locationCounts.get(loc) || 0) + 1);
  }
}

export function getNlpAnalytics() {
  const bloodTypeData = BLOOD_TYPES.map((name) => ({
    name,
    value: bloodTypeCounts[name],
  }));
  const locationData = [...locationCounts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  return { bloodTypeData, locationData, totalRequests };
}
