import { describe, it, expect } from "vitest";
import {
  splitStoredPhoneToForm,
  phoneLocalErrorForCountry,
  localLiveError,
} from "./phoneValidation";

describe("GCC phone validation (register / profile flows)", () => {
  it("splits Oman storage format, validates live prefix, and accepts UAE nationals", () => {
    expect(splitStoredPhoneToForm("96891234567")).toEqual({
      countryCode: "+968",
      local: "91234567",
    });
    expect(localLiveError("+968", "31234567")).toMatch(/7 or 9/i);
    expect(localLiveError("+968", "91234567")).toBe("");
    expect(phoneLocalErrorForCountry("+971", "512345678")).toBe("");
  });
});
