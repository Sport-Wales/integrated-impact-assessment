# API (Azure Functions)

Node Azure Functions backend for the IIA portal. Runs locally on `http://localhost:7071`; the Vite dev server in `app/` proxies `/api` to it.

## Prerequisites

- Node >= 18
- [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local) (`func`)
- PostgreSQL (e.g. [Postgres.app](https://postgresapp.com/) on macOS)

## Local settings

`local.settings.json` is git-ignored and must be created locally.

**New setup:** copy the sample and fill in the connection string.

```sh
cp local.settings.sample.json local.settings.json
```

| Key | Purpose |
| --- | --- |
| `NODE_ENV=development` | Required locally. Without it `getUser` returns `null` (no SWA auth header) and every endpoint returns **401**. |
| `DB_CONNECTION_STRING` | Postgres URL. Missing it gives a **500** ("DB_CONNECTION_STRING not configured"). |
| `DB_TYPE` | `postgres` (default) or `sql`. |

If the password contains special characters, URL-encode them (`@` -> `%40`).

**Existing encrypted file:** if `local.settings.json` has `"IsEncrypted": true`, its values are unreadable. Decrypt it in place:

```sh
func settings decrypt   # run in api/
func settings encrypt   # optional: re-encrypt afterwards
```

Encrypted files can generally only be decrypted on the machine that encrypted them, so ask for the values and use the sample if this fails.

## Local Postgres

The schema is `src/db/schema.sql` (tables `assessments` and `assessment_permissions`, indexes, `updated_at` trigger). It is safe to re-run.

```sh
createdb iia_local
psql iia_local -f src/db/schema.sql
psql iia_local -c '\dt'     # should list both tables
```

Then set `DB_CONNECTION_STRING` to `postgresql://<user>:<password>@localhost:5432/iia_local`.

SSL is skipped automatically for `localhost` / `127.0.0.1` hosts (see `src/db/index.js`) and enabled for Azure. Keep the `user@` part of the string, as that is what the check matches on.

## Run

```sh
npm install
npm start        # func start
```

Check `http://localhost:7071/api/healthCheck`, then run the app from `app/`.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Vite `ECONNREFUSED` / 500 on `/api/*` | `func start` isn't running, or isn't on port 7071. |
| 401 `Unauthorised` | `NODE_ENV=development` missing from `Values`. |
| 500 "DB_CONNECTION_STRING not configured" | Add it to `Values` and restart `func start`. |
| "password authentication failed" | Wrong password, or a literal `<password>` placeholder left in the string. |
| "server does not support SSL" | Host isn't `localhost`/`127.0.0.1`, or the string has no `user@`. |

Restart `func start` after any change to `local.settings.json`.
