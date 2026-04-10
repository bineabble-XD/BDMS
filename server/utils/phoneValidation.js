/**
 * Validates full stored numbers (country code + national digits, no +).
 * Must stay in sync with client/src/utils/phoneValidation.js rules.
 */

const RULES = [
  {
    prefix: "968",
    totalLen: 11,
    localPattern: /^[79]\d{7}$/,
    message:
      "Invalid Omani mobile number. After +968, use 8 digits starting with 7 or 9.",
  },
  {
    prefix: "971",
    totalLen: 12,
    localPattern: /^5\d{8}$/,
    message:
      "Invalid UAE mobile number. After +971, use 9 digits starting with 5.",
  },
  {
    prefix: "966",
    totalLen: 12,
    localPattern: /^5\d{8}$/,
    message:
      "Invalid Saudi mobile number. After +966, use 9 digits starting with 5.",
  },
  {
    prefix: "974",
    totalLen: 11,
    localPattern: /^[367]\d{7}$/,
    message:
      "Invalid Qatar mobile number. After +974, use 8 digits starting with 3, 6, or 7.",
  },
  {
    prefix: "973",
    totalLen: 11,
    localPattern: /^[36]\d{7}$/,
    message:
      "Invalid Bahrain mobile number. After +973, use 8 digits starting with 3 or 6.",
  },
  {
    prefix: "965",
    totalLen: 11,
    localPattern: /^[569]\d{7}$/,
    message:
      "Invalid Kuwait mobile number. After +965, use 8 digits starting with 5, 6, or 9.",
  },
];

export function validateStoredPhoneNumber(phoneNum) {
  const digits = String(phoneNum ?? "").replace(/\D/g, "");

  for (const rule of RULES) {
    if (!digits.startsWith(rule.prefix)) continue;
    if (digits.length !== rule.totalLen) {
      return {
        ok: false,
        message: `Phone number length does not match +${rule.prefix}.`,
      };
    }
    const local = digits.slice(rule.prefix.length);
    if (!rule.localPattern.test(local)) {
      return { ok: false, message: rule.message };
    }
    return { ok: true };
  }

  return { ok: true };
}
