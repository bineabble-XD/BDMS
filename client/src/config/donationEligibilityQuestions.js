/**
 * Eligibility screening — Yes/No questions. Extend ELIGIBILITY_QUESTIONS to add more.
 */

export const ELIGIBILITY_ANSWER = {
  YES: "yes",
  NO: "no",
};

/** @typedef {{ id: string, translationKey: string, disqualifyingAnswer: 'yes' | 'no' }} EligibilityQuestion */

/** @type {EligibilityQuestion[]} */
export const ELIGIBILITY_QUESTIONS = [
  {
    id: "sick10",
    translationKey: "apptElqSick10",
    disqualifyingAnswer: ELIGIBILITY_ANSWER.YES,
  },
  {
    id: "donated8w",
    translationKey: "apptElqDonated8w",
    disqualifyingAnswer: ELIGIBILITY_ANSWER.YES,
  },
  {
    id: "antibiotics",
    translationKey: "apptElqAntibiotics",
    disqualifyingAnswer: ELIGIBILITY_ANSWER.YES,
  },
  {
    id: "surgery",
    translationKey: "apptElqSurgery",
    disqualifyingAnswer: ELIGIBILITY_ANSWER.YES,
  },
];

export function createEmptyEligibilityAnswers() {
  return Object.fromEntries(ELIGIBILITY_QUESTIONS.map((q) => [q.id, ""]));
}

/**
 * @param {Record<string, string>} answers
 */
export function getEligibilityStatus(
  answers,
  extraForm = {}
) {

  const allAnswered = ELIGIBILITY_QUESTIONS.every((q) => {
    const v = answers[q.id];

    return (
      v === ELIGIBILITY_ANSWER.YES ||
      v === ELIGIBILITY_ANSWER.NO
    );
  });

  // Existing screening logic
  const screeningIneligible =
    ELIGIBILITY_QUESTIONS.some(
      (q) =>
        answers[q.id] ===
        q.disqualifyingAnswer
    );

  // New advanced checks
  const extraIneligible =
    extraForm.highBloodPressure === "yes" ||
    extraForm.diabetes === "yes" ||
    extraForm.medsRecently === "yes" ||
    extraForm.tattoo === "yes" ||
    extraForm.travel === "yes" ||
    extraForm.recentDonation === "yes" ||
    extraForm.vaccination === "yes";

  return {
    allAnswered,
    ineligible:
      screeningIneligible ||
      extraIneligible,
  };
}
