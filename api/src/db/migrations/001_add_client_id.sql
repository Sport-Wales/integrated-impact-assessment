-- =============================================================
-- Migration 001: add assessments.client_id
-- =============================================================
--
-- WHY:
--   Fixes duplicate assessments created when the first save is sent more
--   than once (slow network, double click, fetch retry). saveAssessment now
--   inserts with ON CONFLICT (owner_id, client_id), so repeated first saves
--   resolve to one row. Requires this column and index.
--
-- WHEN TO RUN:
--   Against iia-db-dev first, then iia-db-live, BEFORE deploying the new
--   saveAssessment function. Without it, first saves fail with a 500.
--   The old function code keeps working with the column present.
--
-- HOW TO RUN:
--   1. Open pgAdmin or Azure Data Studio and connect using the Azure credentials.
--   2. Select the database (iia-db-dev, then iia-db-live).
--   3. Run this whole file.
--   4. Run the verification queries at the bottom.
--
-- SAFE TO RE-RUN:
--   IF NOT EXISTS on both statements. Non-destructive: existing rows get
--   NULL, and the partial index ignores NULLs, so existing duplicates
--   cannot block it.
--
-- ROLLBACK (roll back the function code too, or first saves will fail):
--   DROP INDEX IF EXISTS uq_assessments_owner_client_id;
--   ALTER TABLE assessments DROP COLUMN IF EXISTS client_id;
-- =============================================================

ALTER TABLE assessments ADD COLUMN IF NOT EXISTS client_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_assessments_owner_client_id
  ON assessments(owner_id, client_id)
  WHERE client_id IS NOT NULL;

-- =============================================================
-- VERIFY (run separately)
-- =============================================================

-- Expect one row: client_id | text | YES
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'assessments' AND column_name = 'client_id';

-- Expect one row
-- SELECT indexname FROM pg_indexes
-- WHERE tablename = 'assessments' AND indexname = 'uq_assessments_owner_client_id';

-- After deploying and creating a new assessment, expect client_id like 'local_...'
-- SELECT id, title, client_id FROM assessments ORDER BY created_at DESC LIMIT 5;
