// api/src/utils/getUser.js
// Extracts the authenticated user's identity from the Azure SWA auth header.
// SWA injects x-ms-client-principal on every authenticated request — this
// is a base64-encoded JSON object containing the user's Azure AD identity.
//
// Returns: { userId, userEmail } or null if header is missing/malformed.
// userId    → Azure AD object ID — stable unique identifier, used as owner_id in DB.
// userEmail → UPN / email address e.g. anselm.powell@sport.wales, used as owner_email.
//
// NOTE: In production, staticwebapp.config.json blocks all /api/* requests that
// are unauthenticated (returns 401 redirect). The null return here is a safety
// net for local development where the header is not present.

const getUser = (request) => {
  const header = request.headers.get('x-ms-client-principal');

  // Local dev fallback — x-ms-client-principal header is only injected by Azure SWA.
  // When running locally with func start or swa start, the header is absent.
  // NODE_ENV=development is set in local.settings.json (git-ignored) so this
  // fallback never triggers in production.
  if (!header) {
    if (process.env.NODE_ENV === 'development') {
      return {
        userId:    'LOCAL_DEV_USER',
        userEmail: 'dev.user@sport.wales',
      };
    }
    return null;
  }

  try {
    const decoded = Buffer.from(header, 'base64').toString('utf-8');
    const principal = JSON.parse(decoded);
    return {
      userId:    principal.userId,
      userEmail: principal.userDetails.toLowerCase(), // normalise — shareAssessment stores lowercase
    };
  } catch {
    return null;
  }
};

module.exports = { getUser };
