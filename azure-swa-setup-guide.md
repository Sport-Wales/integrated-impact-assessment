# The Azure Static Web Apps (SWA) & Managed Functions Guide

## 📖 Deep-Dive Glossary of Concepts

Before writing any code, you must understand the infrastructure you are building.

*   **Azure Static Web Apps (SWA):** SWA is not just a hosting platform; it is an "Orchestrator". In a traditional setup, you have to rent a server for your React app, rent a different server for your Express API, and configure massive security rules so they can talk. SWA takes your GitHub repository, reads the `/app` folder (Frontend), reads the `/api` folder (Backend), hosts them under the exact same domain name (e.g., `sportwales.com/` and `sportwales.com/api`), and automatically handles the security handshake between them.

*   **Managed Functions (Azure Functions):** This is the replacement for Express.js. An Express server stays "awake" 24/7, costing money and requiring maintenance. Managed Functions are "Serverless." When you write a Managed Function, it is completely asleep (costing £0) until a user clicks "Submit" in the React app. It wakes up in milliseconds, processes the data, saves it to the database, and immediately goes back to sleep.

*   **Base64 Identity Scrambling:** When a user logs in via Sport Wales Azure AD, Azure intercepts that login. Instead of forcing you to write complex token-validation logic, Azure confirms the user is valid, bundles their name and ID into a string of text, scrambles it using Base64 encoding, and attaches it as a hidden header (`x-ms-client-principal`) to every API request. Your backend script only has to unscramble it to securely know who is saving the form.

*   **Single Page Application (SPA) Routing:** Your React application is an SPA. This means it only generates one physical file: `index.html`. Pages like `/form1/step3` do not actually exist as folders on a server; React fakes them in the browser using JavaScript. The backend must be explicitly told to route all traffic back to `index.html`, otherwise, if a user hits "refresh," the server will look for a folder named `step3`, fail, and throw a 404 error.

---

## Phase 1: Tool Installation & Environment Preparation

To build and test Azure architecture on your local machine, your laptop needs specific software known as the "Azure Core Tools" to simulate the cloud environment.

### Step 1.1: Install Visual Studio Code Extensions
Microsoft provides extensions that write complicated configuration files automatically.
1. Open Visual Studio Code.
2. Click the **Extensions** icon on the far left activity bar (the icon with four small squares).
3. Search for the exact term: **"Azure Resources"** (Published by Microsoft). Click "Install". This extension now includes the management tools for **Azure Static Web Apps**.
4. Search for the exact term: **"Azure Functions"** (Published by Microsoft). Click "Install".


### Step 1.2: Install the Azure Functions Engine (Core Tools)
*(Note: You require Local Administrator rights on your computer to do this. Do not proceed until IT unblocks you).*
This is the internal engine that processes Serverless code.
1. Navigate to: [Azure Functions Core Tools Download](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local)
2. Follow the instructions to download the Windows `.msi` 64-bit installer.
3. Run the installer and complete the setup.

### Step 1.3: Install the Local Orchestrator (SWA CLI)
The SWA Command Line Interface (CLI) acts as a local proxy. It tricks your laptop into behaving exactly like the Azure cloud servers, allowing you to test the "Fake Login" mechanism.
1. Open a new Terminal inside VS Code (`Terminal -> New Terminal`).
2. Run this Node Package Manager command to install it globally on your machine:
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

---

## Phase 2: Generating the Backend Foundation (`/api`)

The backend is essentially a completely separate mini-project living inside your main repository. We will use the VS Code extension to generate it to guarantee the versioning is flawless.

### Step 2.1: Pre-Create the Backend Folder & Use the Azure Setup Wizard
1. Ensure your entire project (`SW_IIA/integrated-impact-assessment`) is open in VS Code.
2. **CRITICAL FIRST STEP:** Open your VS Code Explorer (the file tree on the left). Create a brand new folder at the very root of your project and name it exactly `api`. 
3. Click the new **Azure Icon** (the large 'A') on your far-left sidebar.
4. Look at the lower section titled "Workspace". Click the small lightning bolt icon with a **+** sign. (When you hover over it, it should say "Create Function").
5. A dropdown menu appears at the top center of VS Code. Follow these exact prompts:
   - **Select the folder:** Do NOT select the root project. Click **"Browse..."**, open the `api` folder you just created, and click "Select".
   - **Select a language:** Choose `JavaScript`.
   - **Select a programming model:** Choose `Model V4` (This is the newest, streamlined standard).
   - **Select a template for your project's first function:** Choose `HTTP trigger` (This is the standard for web APIs).
   - **Provide a function name:** Type `hello` and press Enter (This is just a test endpoint to ensure the connection works).
   - **Authorization level:** Choose `Anonymous` (We will lock this down later with SWA's built-in security).

*Result:* You will now see your files inside the `/api` folder. It will generate `host.json` (server config) and `package.json` (backend dependencies).

### Step 2.2: Hard-Install the Azure Dependencies
The wizard created the folders, but it did not download the actual code libraries needed to make Node.js work with Azure. **If you skip this, your backend will crash instantly.**
1. Open your VS Code Terminal.
2. Type `cd api` and press Enter. (You are now physically "inside" the backend folder).
3. Run the following commands exactly as written:
   ```bash
   npm install @azure/functions
   ```
   *(This installs the core logic that allows serverless functions to run).*
   ```bash
   npm install mssql
   ```
   *(This installs the Microsoft SQL driver so you can connect to the database later).*

### Step 2.3: Establish Local Secrets (`local.settings.json`)
Azure Functions do not use standard `.env` files. They require a specific JSON structure to hold API keys and Connection Strings.
1. Inside the `/api` folder, create a new file named exactly `local.settings.json`.
2. **SECURITY CHECK:** Look at the `.gitignore` file inside `/api`. Ensure `local.settings.json` is listed there. You must never commit passwords to GitHub.
3. Paste the following configuration block entirely:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    
    "DB_CONNECTION_STRING": "Replace_This_With_Database_Password",
    "TENANT_ID": "Replace_This_With_TENANT_ID",
    "AAD_CLIENT_ID": "Replace_This_With_Client_ID",
    "AAD_CLIENT_SECRET": "Replace_This_With_Client_Secret"
  }
}
```
*Explanation:* `FUNCTIONS_WORKER_RUNTIME` tells Azure that this code is Node.js JavaScript. `EnableWorkerIndexing` is a required flag that forces the server to scan your folders to find the endpoints you write.
**Production Impact:** This file is NEVER uploaded to Azure. It is strictly for local testing. In production, you must manually type these secrets into the Azure Portal (covered in Phase 6). If you forget, the live site will crash.

---

## Phase 3: Writing Your First Secure API Endpoint

Now we write the code that will actually receive data from the React frontend.

1. Inside `/api/src/functions/`, create a file named `submitForm.js`.
2. Paste the following exhaustive, fully-commented JavaScript code:

```javascript
// Import the core Azure Functions library we installed earlier
const { app } = require('@azure/functions');

/* 
 * app.http() creates a new API Endpoint.
 * Because the file is named submitForm.js, the URL becomes: /api/submitForm
 */
app.http('submitForm', {
    // Only accept POST requests, which are meant for saving secure data.
    methods: ['POST'], 
    
    // authLevel: 'anonymous' means the script itself doesn't demand a password.
    // WHY? Because Azure SWA intercepts all traffic BEFORE it hits this script,
    // blocks unauthorized users natively, and only passes authorized traffic through.
    authLevel: 'anonymous', 
    
    handler: async (request, context) => {
        // context.log() replaces console.log() in Azure. It streams logs to the cloud.
        context.log('Secure Request Received at /api/submitForm');
        
        // --- STEP 1: Parse the Incoming JSON Payload ---
        let formData;
        try {
            // Unpack the body of the POST request sent by React
            formData = await request.json();
            
            // Validate that they didn't send an empty payload
            if (!formData || Object.keys(formData).length === 0) {
                throw new Error("Empty body");
            }
        } catch (error) {
            context.error("SECURITY: Invalid, malformed, or missing JSON payload received.");
            return { 
                status: 400, // HTTP 400 = Bad Request 
                jsonBody: { error: "Form data is required to submit an assessment." } 
            };
        }
        
        // --- STEP 2: Decode the Entra ID Identification Header ---
        // Azure handles the Microsoft Login, encrypts the user profile, 
        // and injects it into a hidden header called 'x-ms-client-principal'
        const clientPrincipalHeader = request.headers.get('x-ms-client-principal');
        
        // Assume failure initially
        let userObjectId = null; 
        
        if (clientPrincipalHeader) {
            try {
                // Buffer.from takes the Scrambled Base64 text and converts it to raw data
                const encoded = Buffer.from(clientPrincipalHeader, 'base64');
                // We convert it back to English using 'utf-8' so special characters (Welsh) don't crash
                const decoded = encoded.toString('utf-8');
                // Parse the English text back into a usable Javascript Object
                const user = JSON.parse(decoded);
                
                // Grab their unique Microsoft ID
                userObjectId = user.userId; 
                context.log(`Verified Request from Azure User ID: ${userObjectId}`);
            } catch (error) {
                context.error("SECURITY: Failed to decode the Identity Header. Potential tampering.");
                return { 
                    status: 401, // HTTP 401 = Unauthorized
                    jsonBody: { error: "Identity verification failed." } 
                };
            }
        } else {
             // In local development, the header might be missing if they bypass the mock login.
             context.log("WARNING: Request executed without an Auth header. Proceeding as Local Dev.");
             userObjectId = "LOCAL_DEV_USER";
        }

        // --- STEP 3: The Future Database Action ---
        // Once connected, this is where we insert data into Azure SQL.
        // Example:
        // await sql.query(`
        //    INSERT INTO Forms (formId, createdByUserId, status) 
        //    VALUES (@id, @user, 'Submitted')
        // `, { id: formData.formId, user: userObjectId });

        // --- STEP 4: Success Response ---
        return {
            status: 200, // HTTP 200 = OK
            jsonBody: { 
                success: true, 
                message: "Form processing successful", 
                recordedBy: userObjectId 
            }
        };
    }
});
```

---

## Phase 4: Securing the Frontend & Automating the Matrix

The backend code is ready, but it is currently completely vulnerable. We must write the configuration files that instruct the Azure Cloud Infrastructure on how to protect it.

### Step 4.1: The Security Firewall (`staticwebapp.config.json`)
This is the most critical file in the repository. It sits in front of both React and the API and acts as a strict bouncer.

1. In the `/app` folder (where your `package.json` for React lives), create a new file exactly named: `staticwebapp.config.json`
2. Paste the entire configuration below:

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
- **The "auth" block:** This tells Azure, "Do not use consumer Microsoft accounts (like @hotmail). Use the Custom B2B Sport Wales Tenant that tech will give us."
- **The "routes" block:** This tells Azure, "If any request attempts to touch a URL beginning with `/api/`, immediately check if their role is exactly 'authenticated'. If they lack that role, reject them."
- **The "responseOverrides" block:** This tells Azure, "If you reject someone (401 error), do not show them a scary error page. Invisibly redirect (302) them to the Microsoft Login screen so they can authenticate."
- **The "navigationFallback" block (CRUCIAL):** This solves the SPA Routing problem discussed in the Glossary. It ensures users do not receive 404 errors when refreshing deeply nested form pages (like Step 9).

**Production Impact:** This file is the literal security guard for your live website. Azure enforces these exact rules in the cloud. If you make a typo here, the live website could lock out valid staff or leave the API open.

### Step 4.2: The Master CLI Orchestrator (`swa-cli.config.json`)
Locally, your React app runs on port `5173`. Your API runs on port `7071`. We need the SWA CLI tool (installed in Step 1.3) to bridge them together to port `4280`. Writing a gigantic terminal command every time is error-prone, so we will create a config file to automate it.

1. Ensure you are at the absolute **ROOT** of the project (`SW_IIA/integrated-impact-assessment`).
2. Create a file named `swa-cli.config.json`.
3. Paste the following configuration exactly:

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
1. It reads `"run": "npm run dev --prefix ./app"` and automatically launches Vite.
2. It reads `"devServerUrl": "http://localhost:5173"` and connects to the running React app.
3. It reads `"apiLocation": "./api"` and boots up the Azure Functions Core Tools on port 7071.
4. It wraps them both inside a master proxy environment so they can talk securely without CORS errors.

**Production Impact:** Azure completely ignores this file when deployed to the cloud. This file exists purely to trick your laptop into behaving exactly like the Azure cloud, so you can test authentication and routing without breaking the live website.

---

## Phase 5: Pre-Flight Checklist — Running Locally

**GOAL:** Before typing `swa start`, you must verify that your machine meets every prerequisite. Skipping this checklist is the number one cause of failure. Work through every step below in order.

---

### Step 5.1: Verify Your Node.js Version (CRITICAL)

**Why this matters:** Azure Functions Core Tools v4 only supports Node.js versions **18, 20, or 22**. If you have Node.js 24 or newer installed, `swa start` will fail with an incompatibility error and the backend will not boot.

1. Open your VS Code Terminal.
2. Run:
   ```bash
   node --version
   ```
3. Check the output:
   - ✅ If it prints `v18.x.x`, `v20.x.x`, or `v22.x.x` — you are good. Skip to Step 5.2.
   - ❌ If it prints `v24.x.x` or higher — you must downgrade. Follow the fix below.

**Fix: Install Node.js 20 LTS (the recommended version)**

1. Open your browser and go to: **https://nodejs.org/en/download**
2. Make sure **"LTS"** is selected (not "Current").
3. Click **"Windows Installer (.msi)"** — the 64-bit version.
4. Run the downloaded `.msi` installer and accept all defaults.
5. **Completely close and reopen** VS Code.
6. Run `node --version` again — it should now print `v20.x.x`.

---

### Step 5.2: Verify Azure Functions Core Tools

**Why this matters:** The SWA CLI uses Azure Functions Core Tools internally to boot the `/api` backend. If it is missing, the entire backend side of the local environment will silently fail.

1. In your terminal, run:
   ```bash
   func --version
   ```
2. Check the output:
   - ✅ If it prints a version number beginning with `4.` (e.g., `4.0.x`) — you are good. Skip to Step 5.3.
   - ❌ If you see `'func' is not recognized` — it is not installed. Follow the fix below.

**Fix: Install Azure Functions Core Tools v4**

1. Go to: **https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local**
2. Download the **Windows 64-bit `.msi` installer** for **v4**.
3. Run the installer and accept all defaults.
4. Completely close and reopen VS Code.
5. Run `func --version` again to confirm.

---

### Step 5.3: Verify the SWA CLI

**Why this matters:** `swa start` is the command that runs the entire local environment. If the SWA CLI is not installed globally, this command will not exist.

1. In your terminal, run:
   ```bash
   swa --version
   ```
2. Check the output:
   - ✅ If it prints a version number (e.g., `2.0.x`) — you are good. Skip to Step 5.4.
   - ❌ If you see `'swa' is not recognized` — it is not installed. Follow the fix below.

**Fix: Install the SWA CLI**

```bash
npm install -g @azure/static-web-apps-cli
```

After it finishes, run `swa --version` to confirm.

---

### Step 5.4: Verify All Dependencies Are Installed

Both the frontend (`/app`) and backend (`/api`) have their own separate dependencies (like ingredients in a recipe). If you have never installed them, the app will crash on startup.

**For the Backend (`/api`):**
```bash
cd api
npm install
cd ..
```

**For the Frontend (`/app`):**
```bash
cd app
npm install
cd ..
```

After both complete, you should be back at the root of the project.

---

### Step 5.5: Confirm You Are at the Project Root

This is a common mistake. The `swa start` command **must** be run from the very root of the project — not from inside `/app` or `/api`.

1. In your terminal, check your current location:
   ```bash
   pwd
   ```
   *(On Windows PowerShell, use `Get-Location` instead)*
2. The output must end with `\integrated-impact-assessment`.
3. If you are inside `/app` or `/api`, run `cd ..` to go up one level.

---

### Step 5.6: Launch the Local Environment

All checks passed. You are ready to start.

1. From the project root, run:
   ```bash
   swa start
   ```
2. Wait. The SWA CLI will now automatically:
   - Start the Vite React development server on port `5173`.
   - Start the Azure Functions backend on port `7071`.
   - Bridge them both together and expose a unified local server on port `4280`.
3. You will see large confirmation text in the terminal when both are ready.

---

### Step 5.7: Test the Mock Security (Fake Login)

4. **Open your web browser and navigate to exactly: `http://localhost:4280`**
   > ⚠️ **Do NOT go to `http://localhost:5173`** — that bypasses the SWA proxy and the authentication layer will not function.

5. Navigate to: `http://localhost:4280/.auth/login/aad`
   - Instead of hitting the real Microsoft servers, the SWA CLI intercepts this request and displays a **"Fake" developer login screen**.
   - Enter any fake username (e.g., `test.user@sportwales.org`) and click login.
   - You are now "authenticated" locally. The app behaves exactly as it will in the live Azure cloud.

---

### Step 5.8: Test the Backend API is Alive

6. Navigate to: `http://localhost:4280/api/hello`
   - If everything is wired correctly, you will see the words **"Hello, world!"** printed in your browser.
   - This proves the React frontend proxy, the SWA CLI bridge, and the Azure Functions backend are all connected and communicating.

✅ **If you see "Hello, world!" — your local environment is fully operational.**

---

## Phase 6: Production Deployment Instructions

**GOAL:** The purpose of this final phase is to hand off the codebase to the actual Azure Cloud infrastructure that Tech team (IT) is setting up. This phase ensures that every time you type `git push`, Azure automatically rebuilds the website and deploys the backend securely. The settings you enter here dictate if the live site works or crashes.

1. When navigating through the "Create Azure Static Web App" flow in the Azure Portal, you will be prompted for "Build Details".
2. **You MUST enter these exact paths:**
   * **App location:** `/app` (This tells Azure exactly where React lives).
   * **Api location:** `/api` (This tells Azure exactly where the backend functions live).
   * **Output location:** `dist` (This is absolutely critical. Vite builds production code into a folder named `dist`. If you put `build` like older React versions used, the Azure pipeline will push an empty folder, resulting in a blank white page on the live website).
3. **The Deployment Secret:** Azure will automatically place a secret token named `AZURE_STATIC_WEB_APPS_API_TOKEN` into your GitHub Repository under Settings -> Secrets. Doing so grants Github Actions the permission to automatically update your live site every single time you type `git push`. Never delete this token.
4. **Production Secrets (CRITICAL):** Once the SWA is created, you must go to the SWA in the Azure Portal, click on **Configuration** (or Environment Variables) on the left menu, and manually add the keys from your `local.settings.json` file (e.g., `DB_CONNECTION_STRING`, `AAD_CLIENT_ID`, `AAD_CLIENT_SECRET`). **Azure does not upload your local settings file.** If you forget this step, your live API will instantly crash when trying to reach the database or Entra ID.
5. **The GitHub Pull (MANDATORY NEXT STEP):** The moment you finish creating the SWA in the portal, Azure will secretly write a new file directly into your GitHub repository online (a `.github/workflows/` file). You **MUST** open your VS Code terminal and run `git pull` to download that file to your laptop. If you do not pull this file before writing new code, you will trigger a massive merge conflict.