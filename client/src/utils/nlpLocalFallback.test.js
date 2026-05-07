import { describe, it, expect } from "vitest";
import { extractNlpLocal } from "./nlpLocalFallback";

describe("NLP offline fallback (analyze API unavailable)", () => {
  it("extracts blood type, High urgency, and quantity from urgent free text", () => {
    const r = extractNlpLocal(
      "Emergency need 3 bags B+ at Nizwa Hospital tonight!"
    );
    expect(r.bloodType).toBe("B+");
    expect(r.urgency).toBe("High");
    expect(r.quantity).toBe(3);
    expect(r.intent).toBe("urgent_blood_request");
    expect(r.message).toContain("Emergency");
  });
});
