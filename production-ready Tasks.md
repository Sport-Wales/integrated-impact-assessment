great before we do another task lets fix the landing page., we have the table with the user assessments.  we have the complete and the sign off what we are missing is the Review. it should be next to the sign off and instead of a click  it will be blank until the form is signed off. once the form is sign off it will say review, in the sw blue, once the review is complete it will then say reviewed in sw green.  you can also click on it to go to the review page (depending if its a short form 1 or form 2)








production-ready Tasks

Issue 1:
Implementation Complete
File 1: LoginPage.jsx (NEW)

Full-screen login page that fills the entire viewport (fixed inset-0 z-50)
SW Blue background using the existing CSS variable
Sport Wales logo with white fallback (base64 SVG)
Title: "Integrated Impact Assessment"
Subtitle explaining login
"Log in with Microsoft" button with 4-colour Windows icon
Button calls login() which works with both mock auth (local dev) and real Azure auth (production)

File 2: App.jsx (MODIFIED)
Added:

Import LoginPage component
Import useAuth from AuthContext (alongside AuthProvider)
New AuthGate component wrapping the app logic:

Shows loading spinner while auth is resolving
Shows LoginPage if not authenticated
Shows normal app if authenticated



Why this is production-ready

Zero changes needed later — AuthContext already handles both mock and real Azure auth
Simple switch — only VITE_USE_MOCK_AUTH env variable changes between dev and production
No hardcoded paths — login() and logout() routes are defined in AuthContext, not here
Two-layer protection — Azure SWA firewall (server-side) + React frontend (client-side)
Scalable — adding new routes works automatically, they're behind the auth gate



Issue 2: 
The userRole field controls edit vs view access in the entire form — but loadAssessment in FormContext only sets it correctly when loading from the DB response
When a colleague opens a shared assessment, the flow is:

LandingPage calls apiService.getAssessment(id)
The DB response includes user_role: 'edit' or user_role: 'view'
loadAssessment(data) sets userRole: dbResponse.user_role || 'owner'
Every form step checks isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view'

This chain is correct — as long as the backend getAssessment function returns user_role in its response. Since that function doesn't exist yet (it's one of the 10 still to build), this is a critical note for when we build it: the response must include user_role derived from the assessment_permissions table, not just the raw assessments row. The frontend is correctly wired to consume it, but the backend must produce it.
Similarly listAssessments must return user_role per row for the workspace table to show "Owner" vs "Shared" correctly.
This is not a bug in current code — it's a production readiness flag for the backend build.