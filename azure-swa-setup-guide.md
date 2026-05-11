# The Azure Static Web Apps (SWA) & Managed Functions Guide

**STATUS:** ✅ PHASES 1-7 COMPLETE | Ready for Production Deployment

## 📖 Deep-Dive Glossary of Concepts

Before writing any code, you must understand the infrastructure you are building.

*   **Azure Static Web Apps (SWA):** SWA is not just a hosting platform; it is an "Orchestrator". In a traditional setup, you have to rent a server for your React app, rent a different server for your Express API, and configure massive security rules so they can talk. SWA takes your GitHub repository, reads the `/app` folder (Frontend), reads the `/api` folder (Backend), hosts them under the exact same domain name (e.g., `sportwales.com/` and `sportwales.com/api`), and automatically handles the security handshake between them.

*   **Managed Functions (Azure Functions):** This is the replacement for Express.js. An Express server stays "awake" 24/7, costing money and requiring maintenance. Managed Functions are "Serverless." When you write a Managed Function, it is completely asleep (costing £0) until a user clicks "Submit" in the React app. It wakes up in milliseconds, processes the data, saves it to the database, and immediately goes back to sleep.

*   **Base64 Identity Scrambling:** When a user logs in via Sport Wales Azure AD, Azure intercepts that login. Instead of forcing you to write complex token-validation logic, Azure confirms the user is valid, bundles their name and ID into a string of text, scrambles it using Base64 encoding, and attaches it as a hidden header (`x-ms-client-principal`) to every API request. Your backend script only has to unscramble it to securely know who is saving the form.

*   **Single Page Application (SPA) Routing:** Your React application is an SPA. This means it only generates one physical file: `index.html`. Pages like `/form1/step3` do not actually exist as folders on a server; React fakes them in the browser using JavaScript. The backend must be explicitly told to route all traffic back to `index.html`, otherwise, if a user hits "refresh," the server will look for a folder named `step3`, fail, and throw a 404 error.

*   **Connection Pooling:** Instead of opening a new database connection for every single request (which would quickly overwhelm the database), connection pooling creates a "pool" of 10 reusable connections. When a request needs the database, it borrows a connection from the pool, uses it, and returns it. This is critical for serverless functions because hundreds of simultaneous users would otherwise create hundreds of database connections.

---

## Phase 1: Tool Installation & Environment Preparation

✅ **COMPLETED** - To build and test Azure architecture on your local machine, your laptop needs specific software known as the "Azure Core Tools" to simulate the cloud environment.

### Step 1.1: ✅ Install Visual Studio Code Extensions
Microsoft provides extensions that write complicated configuration files automatically.
1. Open Visual Studio Code.
2. Click the **Extensions** icon on the far left activity bar (the icon with four small squares).
3. Search for the exact term: **"Azure Resources"** (Published by Microsoft). Click "Install". This extension now includes the management tools for **Azure Static Web Apps**.
4. Search for the exact term: **"Azure Functions"** (Published by Microsoft). Click "Install".


### Step 1.2: ✅ Install the Azure Functions Engine (Core Tools)
*(Note: You require Local Administrator rights on your computer to do this. Do not proceed until IT unblocks you).*
This is the internal engine that processes Serverless code.
1. Navigate to: [Azure Functions Core Tools Download](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)
2. Follow the instructions to download the Windows `.msi` 64-bit installer.
3. Run the installer and complete the setup.

**Verification:** Open Terminal and type `func --version`. You should see version 4.x.x

### Step 1.3: ✅ Install the Local Orchestrator (SWA CLI)
The SWA Command Line Interface (CLI) acts as a local proxy. It tricks your laptop into behaving exactly like the Azure cloud servers, allowing you to test the "Fake Login" mechanism.
1. Open a new Terminal inside VS Code (`Terminal -> New Terminal`).
2. Run this Node Package Manager command to install it globally on your machine:
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

**Verification:** Type `swa --version`. You should see version 2.0.9 or higher.

---

## Phase 2: Generating the Backend Foundation (`/api`)

✅ **COMPLETED** - The backend is essentially a completely separate mini-project living inside your main repository. We used the VS Code extension to generate it to guarantee the versioning is flawless.

### Step 2.1: ✅ Pre-Create the Backend Folder & Use the Azure Setup Wizard
1. Ensured entire project (`SW_IIA/integrated-impact-assessment`) was open in VS Code.
2. **CRITICAL FIRST STEP:** Created a brand new folder at the very root of project named exactly `api`. 
3. Clicked the new **Azure Icon** (the large 'A') on far-left sidebar.
4. Looked at the lower section titled "Workspace". Clicked the small lightning bolt icon with a **+** sign.
5. Followed these exact prompts:
   - **Select the folder:** Browsed to select the `api` folder we created
   - **Select a language:** Chose `JavaScript`
   - **Select a programming model:** Chose `Model V4` (newest, streamlined standard)
   - **Select a template for your project's first function:** Chose `HTTP trigger`
   - **Provide a function name:** Typed `hello`
   - **Authorization level:** Chose `Anonymous`

*Result:* Files generated inside `/api` folder including `host.json` (server config) and `package.json` (backend dependencies).

### Step 2.2: ✅ Hard-Install the Azure Dependencies
The wizard created the folders, but did not download the actual code libraries needed to make Node.js work with Azure.
1. Opened VS Code Terminal.
2. Typed `cd api` and pressed Enter.
3. Ran the following command:
   ```bash
   npm install
   ```
   *(This installed the core Azure Functions library and both database drivers: `mssql` and `pg`)*

**Result:** Created `/api/node_modules/` folder with all dependencies installed.

### Step 2.3: ✅ CRITICAL SECURITY - Create `/api/.gitignore`
**SECURITY PROTECTION:** Created protection file to prevent accidentally committing database passwords to GitHub.

1. Inside the `/api` folder, created file named exactly `.gitignore`
2. Pasted the following protection rules:

```
# Azure Functions artifacts
bin/
obj/
appsettings.json
local.settings.json

# Node dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
out/

# Logs
*.log
logs/

# Azure Functions local storage
__blobstorage__/
__queuestorage__/
__azurite_db*__.json
```

**Why this is critical:** The `local.settings.json` file contains database password. This `.gitignore` prevents it from ever being pushed to GitHub.

### Step 2.4: ✅ Establish Local Secrets (`local.settings.json`)
Azure Functions do not use standard `.env` files. They require a specific JSON structure to hold API keys and Connection Strings.

**Created:** `/api/local.settings.json` with this configuration:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development",
    
    "DB_TYPE": "postgres",
    "DB_CONNECTION_STRING": "Replace_This_With_Database_Connection_String",
    
    "TENANT_ID": "Replace_This_When_Matt_Gives_It",
    "AAD_CLIENT_ID": "Replace_This_When_Matt_Gives_It",
    "AAD_CLIENT_SECRET": "Replace_This_When_Matt_Gives_It"
  }
}
```

*Explanation:* 
- `FUNCTIONS_WORKER_RUNTIME` tells Azure this code is Node.js JavaScript
- `EnableWorkerIndexing` forces the server to scan folders to find endpoints
- `NODE_ENV` identifies environment for logging
- `DB_TYPE` switches between PostgreSQL and SQL Server

**Production Impact:** This file is NEVER uploaded to Azure. In production, these secrets must be manually entered into Azure Portal.

### Step 2.5: ✅ Update `/api/package.json` Metadata
The Azure wizard created a minimal `package.json`. We replaced it with proper documentation:

```json
{
  "name": "iia-backend-api",
  "version": "1.0.0",
  "description": "Azure Functions backend for Sport Wales Integrated Impact Assessment (IIA) Portal",
  "author": "Sport Wales Development Team",
  "license": "UNLICENSED",
  "private": true,
  "scripts": {
    "start": "func start",
    "test": "echo \"No tests yet...\""
  },
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "mssql": "^12.3.1",
    "pg": "^8.11.3"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "main": "src/{index.js,functions/*.js}"
}
```

**Why this matters:** 
- `engines` field documents Node.js 18+ requirement
- Both `mssql` and `pg` included for database flexibility
- Professional documentation for other developers

---

## Phase 3: Securing the Project Root & Environment Documentation

✅ **COMPLETED** - Protected the entire project from accidentally leaking secrets and documented environment variables.

### Step 3.1: ✅ Create Environment Variable Documentation (`/.env.example`)

**Created:** Complete documentation file at project root showing all required environment variables without exposing secrets.

**Location:** `/.env.example` (project root)

**Contents:**


```bash
# ============================================
# IIA APPLICATION ENVIRONMENT CONFIGURATION
# ============================================
# Copy this file to .env.local and fill in actual values
# NEVER commit .env.local to Git (it contains secrets)

# ============================================
# FRONTEND CONFIGURATION (React/Vite)
# ============================================

# Node environment
NODE_ENV=development

# Enable mock authentication for pure local development (npm run dev)
# Set to 'true' for local UI work without SWA CLI
# Set to 'false' when using 'swa start' or in Azure
VITE_USE_MOCK_AUTH=true

# API Base URL (automatically handled by SWA in production)
# Local dev (npm run dev): /api (proxied via vite.config.js)
# SWA CLI (swa start): /api (handled by SWA proxy)
# Azure dev: /api (automatic)
# Azure prod: /api (automatic)
VITE_API_BASE_URL=/api
```

**What this does:** Provides complete onboarding documentation for new developers without exposing real credentials.


### Step 3.2: ✅ CRITICAL SECURITY - Update `/app/.gitignore`

**SECURITY ALERT:** The React/Vite `.gitignore` does NOT properly protect environment variable files by default. Without updating this, frontend secrets could leak to GitHub.

**Action Taken:**
1. Opened `/app/.gitignore` in VS Code
2. Found the line that says just `.env` (around line 17)
3. Replaced that single line with this block:

```
# CRITICAL: Environment files with secrets
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local
```

**Why this matters:** Different environments (dev, test, prod) use different `.env` files. All variations must be protected.

### Step 3.3: ✅ Verify Root `.gitignore` Protection

**Verified:** The root `.gitignore` file already protects `local.settings.json` at the project level.


**Security Checkpoint:** We now have three layers of protection:
- `/api/.gitignore` - Protects backend secrets
- `/app/.gitignore` - Protects frontend secrets
- `/.gitignore` - Root-level protection as backup

---

## Phase 4: Writing Your First Secure API Endpoint

✅ **COMPLETED** - The connectivity test endpoint `hello.js` was auto-generated by Azure wizard and serves as baseline for testing.

**Note:** The `hello.js` file serves as a connectivity test only. In Phase 8 (after the Ian meeting), you'll create real endpoints like `submitForm.js`, `getForm.js`, and `listForms.js` based on finalized data requirements.

### Step 4.1: ✅ Understanding the Test Endpoint Structure

**Location:** `/api/src/functions/hello.js`

**Purpose:** Tests that backend is running and accepting requests.

**Structure:**
```javascript
const { app } = require('@azure/functions');

app.http('hello', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const name = request.query.get('name') || await request.text() || 'world';
        return { body: `Hello, ${name}!` };
    }
});
```

**Key Features:**
- `authLevel: 'anonymous'` - The function itself doesn't demand authentication because Azure SWA handles that at the infrastructure level
- `context.log()` - Azure's logging system (replaces `console.log`)
- Returns a simple text response for testing

**This endpoint is perfect for testing that your backend is running.** Keep it as-is for now.

**Testing:** Visit `http://localhost:7071/api/hello?name=Test` when backend is running.

---

## Phase 5: Securing the Frontend & Automating the Proxy

✅ **COMPLETED** - Configuration files created that instruct Azure how to protect and route traffic.

### Step 5.1: ✅ The Security Firewall (`staticwebapp.config.json`)

This is the most critical file in the repository. It sits in front of both React and the API and acts as a strict bouncer.

**Location:** `/app/staticwebapp.config.json`


**Contents:**
```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/YOUR_TENANT_ID/v2.0",
          "clientIdSettingName": "AAD_CLIENT_ID",
          "clientSecretSettingName": "AAD_CLIENT_SECRET"
        }
      }
    }
  },
  "routes": [
    {
      "route": "/api/healthCheck",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "401": {
      "statusCode": 302,
      "redirect": "/.auth/login/aad"
    }
  },
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```


**Deep Explanation of this Configuration:**
- **The "auth" block:** Tells Azure, "Do not use consumer Microsoft accounts (like @hotmail). Use the Custom B2B Sport Wales Tenant that tech will give us."
- **The "routes" block:** 
  - `/api/healthCheck` allows anonymous access (Azure Portal monitoring needs this)
  - All other `/api/*` routes require authentication
  - Routes are processed top-to-bottom (specific routes before wildcards)
- **The "responseOverrides" block:** If someone is rejected (401 error), invisibly redirect (302) them to Microsoft Login screen so they can authenticate
- **The "navigationFallback" block (CRUCIAL):** Solves the SPA Routing problem. Ensures users do not receive 404 errors when refreshing deeply nested form pages (like Step 9)

**Production Impact:** This file is the literal security guard for your live website. Azure enforces these exact rules in the cloud. If you make a typo here, the live website could lock out valid staff or leave the API open.

**Why Health Check Is Anonymous:** Azure Portal monitoring tools cannot log in. Without anonymous access to `/api/healthCheck`, Azure cannot monitor if your app is healthy.


### Step 5.2: ✅ The Master CLI Orchestrator (`swa-cli.config.json`)

Locally, your React app runs on port `5173`. Your API runs on port `7071`. We need the SWA CLI tool to bridge them together to port `4280`. This config file automates the entire process.

**Location:** `/swa-cli.config.json` (project root)

**Contents:**
```json
{
  "$schema": "https://aka.ms/azure/static-web-apps-cli/schema",
  "configurations": {
    "iia-app": {
      "appLocation": "./app",
      "apiLocation": "./api",
      "outputLocation": "dist",
      "devServerUrl": "http://localhost:5173",
      "run": "npm run dev --prefix ./app"
    }
  }
}
```

**Deep Explanation of this Configuration:**
When you type `swa start` in your terminal, this file executes a massive sequence:
1. Reads `"run": "npm run dev --prefix ./app"` and automatically launches Vite
2. Reads `"devServerUrl": "http://localhost:5173"` and connects to the running React app
3. Reads `"apiLocation": "./api"` and boots up Azure Functions Core Tools on port 7071
4. Wraps them both inside a master proxy environment on port 4280 so they can talk securely without CORS errors


**Production Impact:** Azure completely ignores this file when deployed to the cloud. This file exists purely to trick your laptop into behaving exactly like the Azure cloud, so you can test authentication and routing without breaking the live website.

---

## Phase 6: Database Layer & Critical Bug Fixes

✅ **COMPLETED** - Built production-ready database connection layer with connection pooling, health monitoring, and dual-database support.

### **OVERVIEW**

We built a **simple, production-ready database layer** that:
- Works with PostgreSQL (primary choice) or SQL Server (fallback)
- Uses connection pooling for scalability
- Includes health monitoring
- Requires NO code changes when switching databases

**Architecture Decision:** Keep both database drivers (`pg` and `mssql`) installed for flexibility. Switch between them using just the `DB_TYPE` environment variable.

**Files created: 3**
**Files updated: 2**

---

### Step 6.1: ✅ Create Database Connection Manager (`/api/src/db/index.js`)

**Location:** `/api/src/db/index.js`

**Purpose:** Main database connection manager. This is the ONLY file functions import for database operations.


**What it does:**
1. Creates a connection pool (reuses connections instead of opening new ones every time)
2. Automatically connects to PostgreSQL or SQL Server based on `DB_TYPE` environment variable
3. Provides a simple `query()` function that works with both database types
4. Handles connection failures gracefully

**Key Concept - Connection Pooling:**
Imagine you're running a library. Without pooling, every person who wants a book would go build their own library. With pooling, you have 10 libraries (the "pool"), and people borrow one when needed and return it when done. This is CRITICAL for serverless functions because hundreds of simultaneous users would otherwise create hundreds of database connections and crash the database.

**How It Works:**
1. First request → Creates pool of 10 database connections, stores in memory
2. Second request → Reuses existing pool (FAST!)
3. 100 concurrent requests → All share the same 10-connection pool

**Critical Bug Fixed:** The original code checked `if (pool && pool.connected)` but PostgreSQL's `pg` library doesn't have a `.connected` property. This caused a NEW pool to be created on EVERY request, defeating connection pooling entirely. Fixed by checking database type first:
```javascript
if (pool) {
    const dbType = process.env.DB_TYPE || 'postgres';
    if (dbType === 'postgres') {
        return pool; // PostgreSQL pool is always ready
    } else if (dbType === 'sql' && pool.connected) {
        return pool; // SQL Server needs .connected check
    }
}
```


**Usage Example:**
```javascript
// In any function file:
const db = require('../db');

// Simple query:
const users = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// That's it! The db module handles:
// - Connection pooling
// - Database type differences
// - Error handling
```

**Why This Is Simple:**
- Functions just call `db.query()` - they don't care which database it is
- Switching databases = change `DB_TYPE` environment variable only
- No code changes needed in function files

---

### Step 6.2: ✅ Create Logging Utility (`/api/src/utils/logger.js`)

**Location:** `/api/src/utils/logger.js`

**Purpose:** Simple logging wrapper that works locally AND in Azure.

**What it does:**
1. When running locally (`npm start`): Logs to console
2. When running in Azure: Logs to Azure Application Insights
3. Functions call `logger.setContext(context)` at start, then use `logger.info()`, `logger.error()`, etc.


**Why This Exists:**
- Local development: `console.log()` works fine for debugging
- Azure production: Must use `context.log()` to send logs to Application Insights (Azure's monitoring dashboard)
- This wrapper detects which environment you're in and calls the right logging method automatically

**Usage Example:**
```javascript
const logger = require('../utils/logger');

// At start of function:
logger.setContext(context);

// Then use anywhere:
logger.info('User submitted form');
logger.error('Database connection failed', error);
logger.warn('Slow query detected');
```

**Why This Is Simple:**
- Only 40 lines of code
- No classes, no configuration
- Just wraps console.log/context.log intelligently

---

### Step 6.3: ✅ Create Health Check Endpoint (`/api/src/functions/healthCheck.js`)

**Location:** `/api/src/functions/healthCheck.js`

**Purpose:** Health monitoring endpoint that tests database connectivity.

**URL:** `/api/healthCheck`
**Method:** GET
**Auth:** Anonymous (no login required)


**What it does:**
1. Tests if database connection works by running `SELECT 1`
2. Returns JSON with system status
3. Returns HTTP 200 if healthy, 503 if unhealthy
4. Azure Portal can monitor this endpoint and automatically restart app if unhealthy

**Example Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2025-05-07T10:30:00.000Z",
  "database": "connected",
  "dbType": "postgres",
  "environment": "development"
}
```

**Example Response (Unhealthy - Before Database Connected):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-05-07T10:30:00.000Z",
  "database": "disconnected",
  "environment": "development",
  "error": "DB_CONNECTION_STRING not configured..."
}
```

**Why This Matters:**
- Azure Portal can monitor this endpoint 24/7
- If it returns 503 three times in a row, Azure can automatically restart your app
- Developers can visit `http://localhost:4280/api/healthCheck` to quickly test if backend is working
- Shows which database type is configured (catches misconfiguration early)


**Testing:** Visit `http://localhost:4280/api/healthCheck` in your browser. You should see JSON response immediately (even before database is connected).

---

### Step 6.4: ✅ Updated Configuration Files

**Updated:** `/api/local.settings.json` 

**Added:**
- `"NODE_ENV": "development"` - Identifies environment for logging
- `"DB_TYPE": "postgres"` - Tells database layer which type to use

**Full Current Content:**
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "NODE_ENV": "development",
    
    "DB_TYPE": "postgres",
    "DB_CONNECTION_STRING": "Replace_This_With_Database_Connection_String",
    
    "TENANT_ID": "Replace_This_When_Matt_Gives_It",
    "AAD_CLIENT_ID": "Replace_This_When_Matt_Gives_It",
    "AAD_CLIENT_SECRET": "Replace_This_When_Matt_Gives_It"
  }
}
```


**Updated:** `/api/package.json`

**Added:** `"pg": "^8.11.3"` - PostgreSQL driver for Node.js

**Full Current Dependencies:**
```json
"dependencies": {
  "@azure/functions": "^4.0.0",
  "mssql": "^12.3.1",
  "pg": "^8.11.3"
}
```

**Why Both Drivers:** Keeping both `mssql` and `pg` provides flexibility:
- Sport Wales might mandate SQL Server for compliance reasons
- Switching databases requires only changing `DB_TYPE` environment variable
- No code changes needed in function files
- Small size impact (~15MB total, lazy-loaded)

**To Install:** After updating package.json, run:
```bash
cd api
npm install
```

---

## Phase 7: Frontend Integration & Authentication

✅ **COMPLETED** - Connected React frontend to Azure Functions backend with authentication system.

### **OVERVIEW**

We built the complete frontend-to-backend connection infrastructure:
- Authentication context (mock for local, real for Azure)
- API service layer (centralized backend calls)
- Vite proxy configuration (routes /api/* to port 7071)


**Files created: 2**
**Files updated: 2**

---

### Step 7.1: ✅ Update Vite Configuration for API Proxy

**Location:** `/app/vite.config.js`

**What Changed:** Added `server.proxy` configuration to forward API requests

**Why This Matters:** When you run `npm run dev` (React only on port 5173), the app needs to talk to the backend on port 7071. Without this proxy, requests to `/api/*` would fail with CORS errors.

**Configuration Added:**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

**How It Works:**
1. React makes request to `/api/hello`
2. Vite intercepts it (sees the `/api` prefix)
3. Vite forwards it to `http://localhost:7071/api/hello`
4. Backend responds
5. Vite passes response back to React

**When This Is Used:** Only during pure React development (`npm run dev`). When using `swa start`, the SWA CLI handles routing instead.


---

### Step 7.2: ✅ Create Authentication Context

**Location:** `/app/src/context/AuthContext.jsx`

**Purpose:** Manages user authentication state across the entire application.

**What It Does:**
1. Detects if running in mock mode (local dev) or real Azure AD mode
2. Checks if user is logged in by fetching `/.auth/me` endpoint
3. Provides login/logout functions
4. Makes user information available to any component via `useAuth()` hook

**Key Concept - React Context:**
Think of Context as a "global variable" for React. Instead of passing user information through 20 nested components (called "prop drilling"), Context lets any component access it directly.

**Mock Authentication:**
When `VITE_USE_MOCK_AUTH=true` in your `.env.local` file:
- No real login required
- Uses fake user: `{userId: 'mock-user', userDetails: 'Local Dev User', userRoles: ['authenticated']}`
- Perfect for UI development when you don't want to deal with real authentication

**Real Authentication:**
When running via `swa start` or in Azure:
- Fetches `/.auth/me` (Azure's built-in endpoint)
- Azure AD handles actual login
- Returns real user information from Sport Wales Active Directory


**Usage Example:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={login}>Log In</button>;
  }
  
  return (
    <div>
      <p>Welcome, {user.userDetails}!</p>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
```

---

### Step 7.3: ✅ Update App.jsx Wrapper Structure

**Location:** `/app/src/App.jsx`

**What Changed:** Wrapped entire app with `<AuthProvider>` component

**Critical Order:**
```javascript
<AuthProvider>          {/* Authentication FIRST */}
  <FormProvider>        {/* Form state SECOND */}
    <Router>            {/* Routing LAST */}
      <Routes>...</Routes>
    </Router>
  </FormProvider>
</AuthProvider>
```


**Why Order Matters:** Authentication must wrap form context because form operations might need user information (e.g., "Save this form for user X"). If FormProvider came first, it wouldn't have access to authentication data.

---

### Step 7.4: ✅ Create API Service Layer

**Location:** `/app/src/services/api.js`

**Purpose:** Centralizes ALL backend API calls in one file.

**Why This Exists:**
Imagine you have 20 React components that call backend endpoints. Without a service layer:
- Each component writes its own fetch code
- If API URL changes, you update 20 files
- If error handling improves, you update 20 files
- Inconsistent error messages across the app

With a service layer:
- All API calls in one file
- URL changes = update one file
- Improved error handling = update one file
- Consistent errors everywhere

**Methods Provided:**
```javascript
// Test backend connection
await api.pingServer();

// Save assessment to database
await api.saveAssessment(formData);

// Get specific assessment
const data = await api.getAssessment(assessmentId);

// List all user's assessments
const list = await api.listAssessments();
```


**Usage Example:**
```javascript
import api from '../services/api';

// In any component:
try {
  const response = await api.saveAssessment(formData);
  console.log('Saved!', response);
} catch (error) {
  console.error('Save failed:', error.message);
}
```

**Error Handling:** Every method includes try-catch blocks and throws clear error messages. Components can handle errors consistently.

---

## Phase 8: GitHub Actions CI/CD Pipeline

✅ **COMPLETED** - Automatic deployment configured for every Git push.

### **OVERVIEW**

GitHub Actions is GitHub's built-in automation service. We created a workflow file that tells GitHub: "Every time someone pushes code to `main` or `develop` branch, automatically build and deploy to Azure."

**File Created:** `/.github/workflows/azure-static-web-apps.yml`

---

### Step 8.1: ✅ Create GitHub Actions Workflow

**Location:** `/.github/workflows/azure-static-web-apps.yml`

**What It Does:**
1. Triggers when code is pushed to `main` or `develop` branch
2. Checks out code from GitHub
3. Builds React frontend (runs `npm run build`)
4. Builds Azure Functions backend
5. Deploys everything to Azure Static Web Apps
6. Handles pull request previews


**Critical Configuration:**
```yaml
app_location: "/app"          # Where React code lives
api_location: "/api"          # Where backend code lives
output_location: "dist"       # Where Vite builds to
```

**Why This Matters:** If these paths are wrong, deployment will succeed but push an empty folder, resulting in a blank white page on the live site.

**Workflow Trigger:**
```yaml
on:
  push:
    branches:
      - main
      - develop
```

**How It Works:**
1. You type `git push origin develop`
2. GitHub detects push to `develop` branch
3. GitHub Actions workflow automatically starts
4. Builds frontend and backend
5. Deploys to Azure Static Web App
6. You receive email: "Deployment successful"
7. Visit your Azure URL → new code is live

**Deployment Tokens:**
Azure automatically creates a secret token called `AZURE_STATIC_WEB_APPS_API_TOKEN` in your GitHub repository. This grants GitHub permission to deploy to Azure. **Never delete this token** or deployments will stop working.

---

### Step 8.2: ✅ Workflow File Created

**Verification:** Check that file exists:
```bash
ls .github/workflows/azure-static-web-apps.yml
```


**When It Activates:** The moment Matt/Tara create the Azure Static Web App and connect it to GitHub, this workflow will start working automatically.

---

## Phase 9: Production Deployment (Awaiting Matt/Tara)

🔄 **PENDING** - Waiting for Tech Team to set up Azure resources.

**GOAL:** Hand off the codebase to Azure Cloud infrastructure. Tech team will create Azure Static Web Apps and configure secrets.

### Step 9.1: ⏳ Azure Portal Configuration (Matt/Tara)

When Tech team creates Azure Static Web App in Azure Portal, they MUST enter these EXACT paths:

**Build Details:**
- **App location:** `/app`
- **Api location:** `/api`
- **Output location:** `dist`

**CRITICAL:** If `Output location` is set to anything other than `dist` (like `build`), deployment will push an empty folder and live site will show blank white page.

---

### Step 9.2: ⏳ GitHub Deployment Secret (Automatic)

**What Happens:** Azure automatically creates a secret token named `AZURE_STATIC_WEB_APPS_API_TOKEN` in your GitHub Repository under **Settings → Secrets and variables → Actions**.

**This grants GitHub Actions permission to automatically update live site every time you `git push`.**

**NEVER delete this token.** If deleted, automatic deployments stop working.


---

### Step 9.3: ⏳ CRITICAL - Configure Production Secrets in Azure

**SECURITY ALERT:** The `local.settings.json` file is NEVER uploaded to Azure. Azure has no idea what your database password or Azure AD credentials are unless Matt/Tara manually configure them.

**What Matt/Tara Must Do:**
1. Go to Azure Portal
2. Navigate to Static Web App
3. Click **Configuration** (or **Environment variables**) in left menu
4. Click **Add** for each of these settings:
   - `NODE_ENV` = `production`
   - `DB_TYPE` = `postgres` (or `sql` if using SQL Server)
   - `DB_CONNECTION_STRING` = [Production database connection string]
   - `TENANT_ID` = [Sport Wales Azure AD tenant ID]
   - `AAD_CLIENT_ID` = [App registration client ID]
   - `AAD_CLIENT_SECRET` = [App registration client secret]

**If this step is forgotten, live API will crash immediately when it tries to connect to database or validate authentication.**

---

### Step 9.4: ⏳ Pull GitHub Actions Workflow (After Azure Setup)

The moment Azure creates your Static Web App and connects to GitHub, Azure might modify the workflow file directly in your online repository.

**You MUST pull changes to your local machine:**
```bash
git pull
```

**If you skip this step and continue coding, you create a merge conflict next time you try to push.**


---

## ✅ IMPLEMENTATION STATUS SUMMARY

### **COMPLETED PHASES:**

✅ **Phase 1: Tool Installation** - VS Code extensions, Azure Functions Core Tools, SWA CLI installed

✅ **Phase 2: Backend Foundation** - `/api` folder generated, dependencies installed, security configured

✅ **Phase 3: Security Protection** - `.gitignore` files created, environment documentation completed

✅ **Phase 4: Test Endpoint** - `hello.js` function created for connectivity testing

✅ **Phase 5: Frontend Security** - `staticwebapp.config.json` created, SWA CLI configured

✅ **Phase 6: Database Layer** - Connection pooling fixed, health monitoring added, dual-database support

✅ **Phase 7: Frontend Integration** - Authentication context created, API service layer built, Vite proxy configured

✅ **Phase 8: CI/CD Pipeline** - GitHub Actions workflow created for automatic deployment

---

### **PENDING PHASES:**

⏳ **Phase 9: Production Deployment** - Awaiting Matt/Tara to create Azure resources

⏳ **Phase 10: Database Connection** - Awaiting Matt to provide database credentials

⏳ **Phase 11: Real API Endpoints** - Awaiting Ian meeting to finalize data requirements

---


## 🧪 TESTING YOUR LOCAL ENVIRONMENT

### Test 1: Pure React Frontend Only
**Purpose:** Test UI without backend complications

**Commands:**
```bash
cd app
npm run dev
```

**Expected Result:**
- React runs on `http://localhost:5173`
- Console shows: "Using mock authentication"
- Forms are accessible
- No real login required

**When To Use:** Pure UI development, styling, component testing

---

### Test 2: Backend API Only
**Purpose:** Test database connections and functions in isolation

**Commands:**
```bash
cd api
npm start
```

**Expected Result:**
- Azure Functions run on `http://localhost:7071`
- Visit: `http://localhost:7071/api/hello?name=Test`
- Should return: "Hello, Test!"
- Visit: `http://localhost:7071/api/healthCheck`
- Should return JSON with system status

**When To Use:** Testing database queries, debugging backend logic

---


### Test 3: Full Stack (Frontend + Backend + Mock Auth)
**Purpose:** Test complete application flow with simulated Azure environment

**Commands:**
```bash
# From project root
swa start
```

**Expected Result:**
- Master proxy runs on `http://localhost:4280`
- React automatically starts on port 5173
- API automatically starts on port 7071
- SWA CLI coordinates everything
- Mock Azure AD login available at `http://localhost:4280/.auth/login/aad`
- Health check accessible: `http://localhost:4280/api/healthCheck`

**When To Use:** 
- Testing authentication flows
- Testing frontend-to-backend communication
- Final integration testing before deploying
- Demonstrating app to stakeholders

**What You'll See:**
```
Azure Static Web Apps CLI (2.0.9)

Using configuration "iia-app"
- Detected React app on port 5173
- Detected Azure Functions on port 7071

Serving static content:
  http://localhost:4280

Serving API endpoints:
  http://localhost:4280/api/*

SWA running in mock authentication mode
```

---


## 🔐 SECURITY CHECKLIST

### Files Protected by .gitignore:
- ✅ `/api/.gitignore` protects `local.settings.json`
- ✅ `/app/.gitignore` protects `.env.local` and variants
- ✅ `/.gitignore` provides root-level backup protection

### Environment Variable Documentation:
- ✅ `/.env.example` documents all required variables
- ✅ No actual secrets in example file
- ✅ Instructions for local setup included

### Authentication Configuration:
- ✅ `staticwebapp.config.json` enforces Azure AD authentication
- ✅ Health check endpoint allows anonymous access (for monitoring)
- ✅ All other API endpoints require authentication
- ✅ 401 errors redirect to Azure AD login

### Production Secrets:
- ⏳ Awaiting Matt to configure in Azure Portal
- ⏳ Database connection string
- ⏳ Azure AD credentials (Tenant ID, Client ID, Client Secret)

---

## 📊 ARCHITECTURE OVERVIEW

### Local Development Workflow:
```
┌─────────────────────────────────────────────────┐
│  YOU TYPE: npm run dev (React only)             │
├─────────────────────────────────────────────────┤
│  React on 5173 → Vite Proxy → API on 7071      │
│  Mock authentication, fast UI iteration         │
└─────────────────────────────────────────────────┘
```


```
┌─────────────────────────────────────────────────┐
│  YOU TYPE: swa start (Full stack)               │
├─────────────────────────────────────────────────┤
│  SWA CLI on 4280 coordinates:                   │
│    - React on 5173                              │
│    - API on 7071                                │
│    - Mock Azure AD                              │
│  Tests complete integration                     │
└─────────────────────────────────────────────────┘
```

### Production Deployment Workflow:
```
┌─────────────────────────────────────────────────┐
│  YOU TYPE: git push origin develop              │
├─────────────────────────────────────────────────┤
│  GitHub Actions triggers automatically          │
│    ↓                                            │
│  Builds React (npm run build → /dist)           │
│    ↓                                            │
│  Builds Azure Functions                         │
│    ↓                                            │
│  Deploys to Azure Static Web Apps               │
│    ↓                                            │
│  Live site updated (iia-dev.azurestaticapps.net)│
└─────────────────────────────────────────────────┘
```

---

## 🗄️ DATABASE CONNECTION FLOW

### How Connection Pooling Works:

**Request 1 (First user visits site):**
```
User clicks Submit
  ↓
Function calls db.query()
  ↓
No pool exists yet
  ↓
Create pool (10 connections)
  ↓
Store pool in memory
  ↓
Execute query
  ↓
Return result
```


**Request 2-100 (Concurrent users):**
```
100 users click Submit simultaneously
  ↓
All functions call db.query()
  ↓
Pool already exists!
  ↓
Reuse existing 10 connections (FAST!)
  ↓
All 100 queries handled efficiently
  ↓
Database not overwhelmed
```

**Why This Matters:**
- Without pooling: 100 users = 100 database connections → database crashes
- With pooling: 100 users = 10 reused connections → database happy

---

## 📂 COMPLETE FILE STRUCTURE

```
integrated-impact-assessment/
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml     ✅ CI/CD automation
├── .gitignore                            ✅ Root protection
├── .env.example                          ✅ Environment docs
├── swa-cli.config.json                   ✅ SWA CLI orchestrator
├── README.md
├── azure-swa-setup-guide.md              ✅ This file
│
├── app/                                  [REACT FRONTEND]
│   ├── .gitignore                        ✅ Frontend protection
│   ├── package.json
│   ├── vite.config.js                    ✅ Proxy configuration
│   ├── staticwebapp.config.json          ✅ Security firewall
│   └── src/
│       ├── App.jsx                       ✅ Updated wrapper
│       ├── context/
│       │   ├── AuthContext.jsx           ✅ Authentication
│       │   └── FormContext.jsx
│       └── services/
│           └── api.js                    ✅ API service layer
│
└── api/                                  [AZURE FUNCTIONS BACKEND]
    ├── .gitignore                        ✅ Backend protection
    ├── package.json                      ✅ Both DB drivers
    ├── local.settings.json               ✅ Local secrets
    ├── host.json
    └── src/
        ├── db/
        │   └── index.js                  ✅ Database connection manager
        ├── utils/
        │   └── logger.js                 ✅ Logging utility
        └── functions/
            ├── hello.js                  ✅ Test endpoint
            └── healthCheck.js            ✅ Health monitoring
```

---


## 🎯 NEXT STEPS & PENDING ITEMS

### Before Production Deployment:

**1. Await Database Credentials from Matt** ⏳
- PostgreSQL connection string format:
  ```
  postgresql://username:password@server:5432/database?sslmode=require
  ```
- Update `local.settings.json` locally for testing
- Matt will configure in Azure Portal for production

**2. Await Azure AD Credentials from Matt** ⏳
- TENANT_ID (Sport Wales tenant identifier)
- AAD_CLIENT_ID (App registration client ID)
- AAD_CLIENT_SECRET (App registration client secret)
- Update `staticwebapp.config.json` with TENANT_ID
- Matt will configure Client ID/Secret in Azure Portal

**3. Meet with Ian (Project Sponsor)** 📅
Purpose: Finalize data requirements for real API endpoints
Questions to answer:
- Which form fields should save to database vs. localStorage?
- What's the auto-save frequency? (every 30 seconds? on field blur?)
- Can users edit assessments after submission?
- What user roles exist? (Admin, Assessor, Viewer?)
- What reports are needed? (User's forms, All forms, Statistics?)
- Should forms have workflow states? (Draft, Submitted, Approved, Rejected?)

**4. Create Real API Endpoints (After Ian Meeting)** 📝
Based on Ian's requirements, create:
- `submitForm.js` - Save complete assessment to database
- `getForm.js` - Retrieve specific assessment by ID
- `listForms.js` - Get all assessments for current user
- `updateForm.js` - Edit existing assessment (if permitted)
- `deleteForm.js` - Remove assessment (if permitted)


**5. Matt/Tara Azure Setup** ⏳
Tech team must:
- Create two Azure Static Web Apps:
  - `iia-dev` (staging environment)
  - `iia-live` (production environment)
- Connect both to GitHub repository
- Configure build paths (app=/app, api=/api, output=dist)
- Add environment variables in Configuration:
  - NODE_ENV
  - DB_TYPE
  - DB_CONNECTION_STRING
  - TENANT_ID
  - AAD_CLIENT_ID
  - AAD_CLIENT_SECRET
- Verify GitHub Actions workflow triggers correctly

---

## 🐛 TROUBLESHOOTING COMMON ISSUES

### Issue: "Cannot find module 'pg'" when starting backend
**Cause:** Database drivers not installed
**Solution:**
```bash
cd api
npm install
```

---

### Issue: Health check returns "DB_CONNECTION_STRING not configured"
**Cause:** Expected - database credentials not provided yet
**Solution:** This is normal until Matt provides database credentials. Health check will show "unhealthy" until then.

---

### Issue: React app shows blank page
**Cause:** Multiple possible causes
**Solutions:**
1. Check console for errors (F12 in browser)
2. Verify `npm run dev` shows no build errors
3. Check `vite.config.js` exists and has proxy configuration
4. Try clearing browser cache (Ctrl+Shift+Delete)

---


### Issue: "swa: command not found"
**Cause:** SWA CLI not installed globally
**Solution:**
```bash
npm install -g @azure/static-web-apps-cli
```

---

### Issue: Backend returns CORS errors in console
**Cause:** Vite proxy not configured OR backend not running
**Solution:**
1. Verify `/app/vite.config.js` has proxy configuration
2. Make sure backend is running (`cd api && npm start`)
3. Or use `swa start` instead (handles routing automatically)

---

### Issue: "Port 7071 already in use"
**Cause:** Azure Functions already running in another terminal
**Solution:**
1. Find other terminal and close it, OR
2. Kill process: 
   - Windows: `netstat -ano | findstr :7071` then `taskkill /PID [number] /F`
   - Mac/Linux: `lsof -ti:7071 | xargs kill`

---

### Issue: Git push doesn't trigger deployment
**Cause:** GitHub Actions workflow not configured or Azure token missing
**Solution:**
1. Check GitHub repo → Actions tab → See if workflow exists
2. Check GitHub repo → Settings → Secrets → Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` exists
3. Matt/Tara must connect Azure Static Web App to GitHub (auto-creates token)

---

## 📚 KEY CONCEPTS SUMMARY

### What is Connection Pooling?
Instead of opening a new database connection for every request (expensive), we create 10 connections at startup and reuse them. Like having 10 phone lines instead of installing a new phone for every call.


### What is Serverless?
Traditional server: Runs 24/7, costs money even when nobody is using it.
Serverless function: Completely asleep (£0) until someone clicks a button. Wakes in milliseconds, processes request, goes back to sleep.

### What is CI/CD?
**CI (Continuous Integration):** Every time you push code, GitHub automatically checks it builds correctly.
**CD (Continuous Deployment):** If build succeeds, GitHub automatically deploys to Azure. No manual file uploads needed.

### What is a Proxy?
Acts as a middleman. React on port 5173 wants to talk to API on port 7071, but browsers block this (CORS security). Proxy sits in the middle and forwards requests, making it look like everything is on the same port.

### What is Azure AD Authentication?
Azure Active Directory is Microsoft's employee login system. Instead of creating our own username/password system (which is complex and insecure), we tell Azure "only let Sport Wales staff log in" and Azure handles all the security.

### What is a Health Check?
An endpoint (`/api/healthCheck`) that returns "I'm alive" or "Something is wrong." Azure Portal checks this every 5 minutes. If it fails 3 times, Azure can automatically restart your app or send alerts.

### What is Mock Authentication?
During local development, you don't want to deal with real Azure AD login every time you refresh. Mock auth creates a fake "logged in" user so you can focus on building features.

---

## ✅ FINAL CHECKLIST

### Development Environment Ready:
- ✅ VS Code extensions installed
- ✅ Azure Functions Core Tools installed
- ✅ SWA CLI installed globally
- ✅ Node.js 18+ verified

### Backend Configured:
- ✅ `/api` folder generated
- ✅ Dependencies installed (`npm install` completed)
- ✅ `local.settings.json` created with placeholders
- ✅ Database connection manager created
- ✅ Health check endpoint created
- ✅ Logging utility created
- ✅ Test endpoint (`hello.js`) working

### Frontend Configured:
- ✅ Vite proxy configured
- ✅ Authentication context created
- ✅ API service layer created
- ✅ App.jsx wrapper updated
- ✅ Security firewall (`staticwebapp.config.json`) configured

### Security Implemented:
- ✅ All `.gitignore` files protecting secrets
- ✅ Environment variable documentation (`.env.example`)
- ✅ Three-layer protection (api, app, root)
- ✅ Health check allows anonymous access
- ✅ All other endpoints require authentication

### CI/CD Pipeline:
- ✅ GitHub Actions workflow created
- ✅ Configured for automatic deployment
- ✅ Separate dev/prod environments supported

### Awaiting External Dependencies:
- ⏳ Database credentials from Matt
- ⏳ Azure AD credentials from Matt
- ⏳ Ian meeting for data requirements
- ⏳ Azure Static Web Apps created by Matt/Tara

---

## 🎓 LEARNING RESOURCES

### Official Microsoft Documentation:
- Azure Static Web Apps: https://learn.microsoft.com/en-us/azure/static-web-apps/
- Azure Functions: https://learn.microsoft.com/en-us/azure/azure-functions/
- Azure AD Authentication: https://learn.microsoft.com/en-us/azure/active-directory/

### PostgreSQL Documentation:
- Node.js driver (pg): https://node-postgres.com/
- Connection pooling: https://node-postgres.com/features/pooling

### GitHub Actions:
- Workflow syntax: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions

---

**📝 END OF GUIDE - Backend foundation complete and ready for production deployment after external dependencies are provided.**