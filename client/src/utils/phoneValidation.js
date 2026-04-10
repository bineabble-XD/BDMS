/**
 * GCC mobile-style rules for the country codes offered at register / profile.
 * Lengths match national numbers without the leading + (E.164 after country code).
 */

export const OMAN_COUNTRY_CODE = "+968";

/** Country code dropdown options (GCC) — keep in sync with Register / Profile / Hospital flows. */
export const GCC_COUNTRY_CODES = ["+968", "+971", "+966", "+974", "+973", "+965"];

const LOCAL_LEN_BY_PREFIX = {
  "968": 8,
  "971": 9,
  "966": 9,
  "974": 8,
  "973": 8,
  "965": 8,
};

const PREFIXES = ["968", "971", "966", "974", "973", "965"];

/**
 * Parse stored value (digits only, e.g. 96891234567) into country code + local part.
 */
export function splitStoredPhoneToForm(phoneNum) {
  if (phoneNum == null || phoneNum === "") {
    return { countryCode: OMAN_COUNTRY_CODE, local: "" };
  }
  const digits = String(phoneNum).replace(/\D/g, "");
  for (const prefix of PREFIXES) {
    if (!digits.startsWith(prefix)) continue;
    const want = LOCAL_LEN_BY_PREFIX[prefix];
    const local = digits.slice(prefix.length);
    if (local.length === want) {
      return { countryCode: `+${prefix}`, local };
    }
  }
  if (digits.length >= 11) {
    const local = digits.slice(-8);
    const prefix = digits.slice(0, -8);
    const code = PREFIXES.includes(prefix) ? `+${prefix}` : OMAN_COUNTRY_CODE;
    return { countryCode: code, local };
  }
  return { countryCode: OMAN_COUNTRY_CODE, local: digits };
}

/** Digits allowed in the local part after the country code (no +). */
export function maxLocalDigitsForCountry(countryCode) {
  return countryCode === "+971" || countryCode === "+966" ? 9 : 8;
}

/**
 * Inline hint while typing: first digit(s) must match that country's mobile pattern.
 */
export function localLiveError(countryCode, localDigits) {
  const s = String(localDigits ?? "").replace(/\D/g, "");
  if (s.length === 0) return "";
  switch (countryCode) {
    case "+968": {
      const first = s[0];
      if (first !== "7" && first !== "9") {
        return "Omani mobile numbers start with 7 or 9.";
      }
      return "";
    }
    case "+971":
      if (s[0] !== "5") return "UAE mobile numbers start with 5.";
      return "";
    case "+966":
      if (s[0] !== "5") return "Saudi mobile numbers start with 5.";
      return "";
    case "+974":
      if (!/^[367]/.test(s)) {
        return "Qatar mobile numbers start with 3, 6, or 7.";
      }
      return "";
    case "+973":
      if (s[0] !== "3" && s[0] !== "6") {
        return "Bahrain mobile numbers start with 3 or 6.";
      }
      return "";
    case "+965":
      if (!/^[569]/.test(s)) {
        return "Kuwait mobile numbers start with 5, 6, or 9.";
      }
      return "";
    default:
      return "";
  }
}

/** Kept for any code that still imports the old name. */
export function omaniLocalLiveError(localDigits) {
  return localLiveError(OMAN_COUNTRY_CODE, localDigits);
}

export function phoneLocalErrorForCountry(countryCode, localDigits) {
  const s = String(localDigits ?? "").replace(/\D/g, "");
  const max = maxLocalDigitsForCountry(countryCode);
  if (s.length !== max) {
    return `Enter exactly ${max} digits for this country code.`;
  }

  const rules = {
    "+968": {
      test: (d) => /^[79]\d{7}$/.test(d),
      msg: "Omani mobile numbers must be 8 digits starting with 7 or 9.",
    },
    "+971": {
      test: (d) => /^5\d{8}$/.test(d),
      msg: "UAE mobile numbers must be 9 digits starting with 5.",
    },
    "+966": {
      test: (d) => /^5\d{8}$/.test(d),
      msg: "Saudi mobile numbers must be 9 digits starting with 5.",
    },
    "+974": {
      test: (d) => /^[367]\d{7}$/.test(d),
      msg: "Qatar mobile numbers must be 8 digits starting with 3, 6, or 7.",
    },
    "+973": {
      test: (d) => /^[36]\d{7}$/.test(d),
      msg: "Bahrain mobile numbers must be 8 digits starting with 3 or 6.",
    },
    "+965": {
      test: (d) => /^[569]\d{7}$/.test(d),
      msg: "Kuwait mobile numbers must be 8 digits starting with 5, 6, or 9.",
    },
  };

  const rule = rules[countryCode];
  if (!rule) return "";
  if (!rule.test(s)) return rule.msg;
  return "";
}
