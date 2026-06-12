-- =============================================================
-- Sport Wales — Integrated Impact Assessment Portal
-- Database Schema
-- =============================================================
--
-- HOW TO RUN:
--   1. Open pgAdmin or Azure Data Studio
--   2. Connect to your PostgreSQL server using the credentials from Azure
--   3. Select iia-db-dev from the database list
--   4. Open this file and run it (F5 in pgAdmin, Run in Azure Data Studio)
--   5. Repeat against iia-db-live when ready for production
--
-- SAFE TO RE-RUN:
--   Uses CREATE TABLE IF NOT EXISTS — running again will not destroy data.
--   To fully reset during development, run the two DROP lines at the bottom first.
--
-- =============================================================

-- Required for gen_random_uuid() — generates UUID primary keys automatically.
-- Both extensions included for compatibility across Azure PostgreSQL configurations.
-- IF NOT EXISTS means this is safe to run multiple times.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- TABLE 1: assessments
-- One row per assessment. Stores all form data as JSONB.
-- =============================================================
CREATE TABLE IF NOT EXISTS assessments (

  -- Primary key — UUID generated automatically by the database.
  -- Frontend receives this after first save and stores it as assessmentId.
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The Azure AD user ID of the person who created this assessment.
  -- Comes from the SWA /.auth/me endpoint: clientPrincipal.userId
  -- Used to filter assessments on listAssessments and enforce ownership.
  owner_id         TEXT NOT NULL,

  -- The email address of the owner — e.g. anselm.powell@sport.wales
  -- Stored for display purposes and sharing logic.
  -- Comes from clientPrincipal.userDetails on the SWA auth header.
  owner_email      TEXT NOT NULL,

  -- 'form1' = Full IIA, 'form2' = Short IIA
  -- Set when the user picks a form type on the form selection page.
  form_type        TEXT NOT NULL CHECK (form_type IN ('form1', 'form2')),

  -- The assessment title — entered by the user in Step 1.
  -- Displayed in the workspace table. Required once saved to DB.
  title            TEXT NOT NULL DEFAULT '',

  -- The lead person's name — entered in Step 1.
  -- Stored as a top-level column for quick display without parsing form_data.
  lead_name        TEXT NOT NULL DEFAULT '',


  -- Assessment lifecycle status.
  -- 'draft'      → in progress, user still filling out steps
  -- 'complete'   → all steps done, marked complete by user in Step 8 / Form2 Step 2
  -- 'signed_off' → permanently locked, no further edits allowed
  status           TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'complete', 'signed_off')),

  -- All form field answers stored as a single JSON object.
  -- This mirrors the FormContext shape exactly:
  -- { title, leadName, leadRole, otherPeople, workDetails,
  --   completedSteps, form1: { ... }, form2: { ... }, ... }
  -- JSONB = stored as binary JSON — fast to query, indexed if needed.
  form_data        JSONB NOT NULL DEFAULT '{}',

  -- Array of completed step indexes per form type.
  -- e.g. { "form1": [0,1,2,3], "form2": [] }
  -- Stored separately from form_data for quick reads by the progress bar.
  completed_steps  JSONB NOT NULL DEFAULT '{}',

  -- Timestamps — all managed by the database or backend functions.
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Set when the user clicks "Mark as Complete" (status → complete).
  completed_at     TIMESTAMPTZ,

  -- Set when the owner clicks "Sign Off" (status → signed_off).
  signed_off_at    TIMESTAMPTZ,

  -- The owner_id of the person who signed off — for audit trail.
  -- Comes from the SWA auth header at sign-off time.
  signed_off_by    TEXT,

  -- Set when the owner completes the Final Review step (Step 10 / Form2 Step 4).
  -- Written by the backend when reviewedAt is present in the save payload.
  -- Used by the workspace table to show the Review column status.
  reviewed_at      TIMESTAMPTZ

);


-- =============================================================
-- TABLE 2: assessment_permissions
-- One row per person who has been granted access to an assessment.
-- Owner is NOT stored here — ownership is tracked on the assessments table.
-- =============================================================
CREATE TABLE IF NOT EXISTS assessment_permissions (

  -- Primary key
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Which assessment this permission applies to.
  -- CASCADE DELETE: if the assessment is deleted, all its permissions are deleted too.
  -- This means we never have orphaned permission rows.
  assessment_id  UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,

  -- The Sport Wales email address of the person being granted access.
  -- e.g. tara.jones@sport.wales
  -- Validated as @sport.wales only at the frontend (ShareModal) and backend level.
  user_email     TEXT NOT NULL,

  -- What the person can do with the assessment.
  -- 'view' → read-only access
  -- 'edit' → can fill in and save form steps
  role           TEXT NOT NULL CHECK (role IN ('view', 'edit')),

  -- When this permission was granted — for audit trail.
  granted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevents the same person being added twice to the same assessment.
  -- Also allows UPSERT (INSERT ... ON CONFLICT) to update the role
  -- if the owner changes someone from view → edit or vice versa.
  UNIQUE (assessment_id, user_email)

);


-- =============================================================
-- INDEXES
-- Speed up the most common queries in the application.
-- =============================================================

-- listAssessments: fetch all assessments owned by this user
-- Most frequent query — runs every time the workspace loads.
CREATE INDEX IF NOT EXISTS idx_assessments_owner_id
  ON assessments(owner_id);

-- listAssessments: filter by status (e.g. only show drafts, or only signed off)
CREATE INDEX IF NOT EXISTS idx_assessments_status
  ON assessments(status);

-- getPermissions + shareAssessment: fetch all permissions for one assessment
-- Runs when ShareModal opens to show who currently has access.
CREATE INDEX IF NOT EXISTS idx_permissions_assessment_id
  ON assessment_permissions(assessment_id);

-- listAssessments shared query: find all assessments shared with this user's email
-- Runs on every workspace load for the shared-with-me part of the UNION query.
CREATE INDEX IF NOT EXISTS idx_permissions_user_email
  ON assessment_permissions(user_email);

-- Note: the UNIQUE(assessment_id, user_email) constraint on assessment_permissions
-- automatically creates a 5th index — no need to add one manually.


-- =============================================================
-- AUTO-UPDATE updated_at
-- PostgreSQL doesn't update timestamps automatically — we need a
-- trigger function that fires on every UPDATE to the assessments table.
-- =============================================================

-- Step 1: Create the reusable trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Attach it to the assessments table
-- DROP first so re-running this script doesn't throw a "trigger already exists" error
DROP TRIGGER IF EXISTS set_updated_at ON assessments;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- RESET (for development only)
-- Uncomment these two lines to wipe all data and start fresh.
-- Run them BEFORE the CREATE TABLE statements above.
-- NEVER run against iia-db-live.
-- =============================================================
-- DROP TABLE IF EXISTS assessment_permissions;
-- DROP TABLE IF EXISTS assessments;
