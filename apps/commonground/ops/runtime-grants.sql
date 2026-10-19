
-- Run with a privileged MIGRATION OWNER after creating a separate runtime DB user.
-- Never use DATABASE_MIGRATION_URL in production functions.
-- Manual provisioning, example:
--   CREATE ROLE commonground_runtime LOGIN PASSWORD '<set out of band with secrets manager>';
-- OR grant these rights to a secure, separate runtime user of your database.
-- This script intentionally requires the commonground_runtime role to exist.
BEGIN;
GRANT USAGE ON SCHEMA app TO commonground_runtime;
GRANT SELECT,INSERT,UPDATE ON app.accounts TO commonground_runtime;
GRANT SELECT,INSERT,UPDATE,DELETE ON app.login_tokens TO commonground_runtime;
GRANT SELECT,INSERT,UPDATE,DELETE ON app.sessions TO commonground_runtime;
GRANT SELECT ON app.communities,app.memberships,app.parcels,app.parcel_claims TO commonground_runtime;
GRANT SELECT,INSERT,UPDATE ON app.cases TO commonground_runtime;
GRANT SELECT ON app.case_participants TO commonground_runtime;
GRANT SELECT,INSERT ON app.case_events TO commonground_runtime;
GRANT EXECUTE ON FUNCTION app.current_actor() TO commonground_runtime;
GRANT EXECUTE ON FUNCTION app.can_access_case(uuid) TO commonground_runtime;
GRANT EXECUTE ON FUNCTION app.upsert_verified_account(text) TO commonground_runtime;
-- All other domain tables have no runtime grants and have deny-by-default RLS.
COMMIT;
