import React from "react";
import {
  ELIGIBILITY_QUESTIONS,
  ELIGIBILITY_ANSWER,
  getEligibilityStatus,
} from "../config/donationEligibilityQuestions";

/** Radio questions only — parent supplies "Eligibility Screening" heading. */
export default function DonationEligibilityCheck({ answers, onChange, t }) {
  const { allAnswered, ineligible } = getEligibilityStatus(answers);

  return (
    <div className="donation-eligibility-radios mb-4">
      <p className="text-muted mb-3">{t("apptEligibilityCheckIntro")}</p>

      {ELIGIBILITY_QUESTIONS.map((q) => (
        <div key={q.id} className="mb-3">
          <fieldset className="m-0 p-0 border-0">
            <legend className="form-label fw-semibold mb-2 d-block w-100">
              {t(q.translationKey)}
            </legend>
            <div className="d-flex flex-wrap gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={q.id}
                  id={`${q.id}-yes`}
                  value={ELIGIBILITY_ANSWER.YES}
                  checked={answers[q.id] === ELIGIBILITY_ANSWER.YES}
                  onChange={() => onChange(q.id, ELIGIBILITY_ANSWER.YES)}
                  required
                />
                <label className="form-check-label" htmlFor={`${q.id}-yes`}>
                  {t("apptYes")}
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={q.id}
                  id={`${q.id}-no`}
                  value={ELIGIBILITY_ANSWER.NO}
                  checked={answers[q.id] === ELIGIBILITY_ANSWER.NO}
                  onChange={() => onChange(q.id, ELIGIBILITY_ANSWER.NO)}
                />
                <label className="form-check-label" htmlFor={`${q.id}-no`}>
                  {t("apptNo")}
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      ))}

      {!allAnswered && (
        <p className="text-muted mb-2" role="status">
          {t("apptEligibilityAnswerAll")}
        </p>
      )}

      {ineligible && (
        <div className="alert alert-warning py-2 mb-0" role="alert">
          {t("apptEligibilityNotEligible")}
        </div>
      )}
    </div>
  );
}
