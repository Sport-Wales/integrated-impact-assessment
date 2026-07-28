// api/src/utils/superusers.js
// Determines whether a user has superuser (view-all) access.
//
// In Azure SWA (dev + prod): reads the SUPER_USER environment variable.
//   Set via: Static Web Apps → Configuration → Environment variables
//   Format:  comma-separated emails, e.g.
//            anselm.powell@sport.wales,tara.rhoseyn@sport.wales,ian.blackburn@sport.wales
//
// In local dev: SUPER_USER env var is not set, so falls back to the
//   hardcoded LOCAL_SUPERUSERS array below.
//
// Superusers can VIEW every assessment in the system.
// They cannot edit, delete, sign off, or share assessments they don't own.
// All write endpoints independently verify ownership — no extra guards needed here.

// Fallback list — used only when SUPER_USER env var is absent (local dev).
// Update this array to match the Azure env var when adding/removing people.
const LOCAL_SUPERUSERS = [
  'emma.wilkins@sport.wales',
  'tara.rhoseyn@sport.wales',
  'ian.blackburn@sport.wales',
  'paul.batcup@sport.wales',
];

/**
 * Returns the active superuser email list.
 * Reads SUPER_USER env var in Azure; falls back to LOCAL_SUPERUSERS locally.
 * @returns {string[]} lowercase email strings
 */
const getSuperUsers = () => {
  const envVar = process.env.SUPER_USER;
  if (envVar && envVar.trim()) {
    return envVar.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  }
  return LOCAL_SUPERUSERS.map(e => e.toLowerCase());
};

/**
 * Returns true if the given email is a superuser.
 * Case-insensitive. Returns false for null/undefined.
 * @param {string} email
 * @returns {boolean}
 */
const isSuperUser = (email) => {
  if (!email) return false;
  return getSuperUsers().includes(email.toLowerCase());
};

module.exports = { isSuperUser };
