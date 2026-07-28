// src/utils/reviewGate.js
// Determines when the "Final Review" step becomes available.
//
// Workflow: the review looks back at what actually happened once the work has
// taken place — it can only start once the assessment has been submitted, and
// only once enough time has passed for that to be meaningful:
//   - The lead's chosen "Review date" (Form1 Step 8 / Form2 Step 2), or 6
//     months after submission if that was left blank.
//
// Accepts either a FormContext formData object (camelCase: signedOffAt, formType,
// form1.reviewDate / form2.reviewDate) or a listAssessments/localStorage-fallback
// row (snake_case: signed_off_at, form_type, review_date) — both shapes are used
// across the app.
const DEFAULT_REVIEW_MONTHS = 6;

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

export const getReviewAvailability = (data) => {
  const isSubmitted = data.status === 'signed_off';
  const signedOffAtRaw = data.signedOffAt || data.signed_off_at;

  if (!isSubmitted || !signedOffAtRaw) {
    return { isSubmitted, availableFrom: null, isAvailable: false };
  }

  const signedOffAt = new Date(signedOffAtRaw);
  const defaultAvailableFrom = addMonths(signedOffAt, DEFAULT_REVIEW_MONTHS);

  const formType = data.formType || data.form_type;
  const reviewDateRaw = formType === 'form1'
    ? (data.form1?.reviewDate || data.review_date)
    : (data.form2?.reviewDate || data.review_date);

  let availableFrom = defaultAvailableFrom;
  if (reviewDateRaw) {
    const chosen = new Date(reviewDateRaw);
    if (!isNaN(chosen.getTime())) {
      // Never earlier than submission itself, even if the chosen date has passed.
      availableFrom = chosen > signedOffAt ? chosen : signedOffAt;
    }
  }

  return {
    isSubmitted: true,
    availableFrom,
    isAvailable: new Date() >= availableFrom,
  };
};
