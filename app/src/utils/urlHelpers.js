/**
 * Utility for building shareable URLs with assessment ID and current step.
 *
 * @param {string} pathname - Current pathname (e.g., '/form1/step5')
 * @param {string} assessmentId - Assessment UUID
 * @returns {string|null} Full shareable URL or null if no assessmentId
 *
 * Example:
 *   buildShareUrl('/form1/step5', 'abc-123')
 *   // Returns: 'https://domain.com/form1/step5?id=abc-123'
 */
export const buildShareUrl = (pathname, assessmentId) => {
  if (!assessmentId) return null;
  return `${window.location.origin}${pathname}?id=${assessmentId}`;
};
