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