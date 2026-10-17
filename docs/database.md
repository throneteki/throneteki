# Database

The lobby is moving from MongoDB to PostgreSQL. Until that move is finished both are configured:
`dbPath` is the Mongo connection the services still use, and `db` is the Postgres connection.

| Path                                             | What it is                                                                    |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| [server/db/index.js](../server/db/index.js)      | Connection pool: `query(text, params)`, `transaction(callback)`, `shutdown()` |
| [server/db/migrate.js](../server/db/migrate.js)  | Applies or reverts schema migrations                                          |
| [server/db/migrations/](../server/db/migrations) | The migrations, applied in filename (timestamp) order                         |
| [server/db/schema.sql](../server/db/schema.sql)  | The schema after every migration has run, generated, for reading and review   |

Migrations are run by [node-pg-migrate](https://salsita.github.io/node-pg-migrate/), which records
each applied migration in the `pgmigrations` table and holds an advisory lock while it runs, so two
runs can never apply the same migration.

## Local development

`docker-compose.yml` includes a `postgres` service, and `config/default.json5` points at it.

```sh
npm run db:migrate              # apply every pending migration
npm run db:migrate:down         # revert the last migration (or: -- 3, -- all)
npm run db:migrate:create -- add-deck-notes   # new server/db/migrations/<timestamp>_add-deck-notes.sql
npm run db:schema:dump          # regenerate server/db/schema.sql from the compose database
```

## Writing a migration

A migration is a plain SQL file with an up section and a down section. Each migration runs in its
own transaction.

```sql
-- Up Migration
ALTER TABLE decks ADD COLUMN notes text;

-- Down Migration
ALTER TABLE decks DROP COLUMN notes;
```

The rules, most of which CI enforces:

1. **Never edit a merged migration.** Fix or change it with a new migration. CI fails a pull request
   that modifies, renames or deletes a migration already on the target branch.
2. **Always write the down section.** CI applies every migration, reverts them all, and applies
   them again. Production is never rolled back, though (see 4).
3. **Keep each migration compatible with the code already running.** Migrations are applied by a
   Helm pre-upgrade hook, so the previous release keeps serving against the new schema until its
   pods are replaced. Change things in two steps: add the new column or table in one release, and
   only stop using or drop the old one in a later release.
4. **Roll production forward.** If a migration is wrong, fix it with another migration.
   `migrate.js down` refuses to run in production unless given `--allow-production-down`.
5. **Commit the regenerated `schema.sql`** with every migration. CI fails if it doesn't match.
6. **Schema only.** Data changes belong in a migration only when they're plain SQL over data
   already in Postgres. Anything that needs another system, such as the one-off copy from Mongo,
   is a script under `server/scripts`.

Conventions:

- snake_case names, plural table names
- `bigint generated always as identity` primary keys
- `timestamptz` for every time, named `..._at`
- `inet` for IP addresses and `cidr` for subnets
- every foreign key has an explicit `ON DELETE`
- small fixed sets of values (trust states, permissions) are `CHECK` constraints, so adding one
  is a migration; sets that grow with the card data (factions, packs) are validated in code
- case-insensitive uniqueness is a unique index on `lower(column)`, and queries must compare
  `lower(column) = lower($1)` for the index to be used

## Roles

There are two roles. The lobby connects as the application role, which can read and write rows
but not change the schema. Migrations connect as the migrator role, which owns the schema. Create
both once per environment as a superuser:

```sql
CREATE ROLE throneteki_migrator LOGIN PASSWORD '...';
CREATE ROLE throneteki_app LOGIN PASSWORD '...';
CREATE DATABASE throneteki OWNER throneteki_migrator;

\c throneteki
REVOKE ALL ON DATABASE throneteki FROM PUBLIC;
GRANT CONNECT ON DATABASE throneteki TO throneteki_app;
GRANT USAGE ON SCHEMA public TO throneteki_app;

-- Everything the migrator creates from now on is readable and writable by the app
ALTER DEFAULT PRIVILEGES FOR ROLE throneteki_migrator IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO throneteki_app;
ALTER DEFAULT PRIVILEGES FOR ROLE throneteki_migrator IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO throneteki_app;
```

On PostgreSQL 15 and later the `public` schema belongs to the database owner, so the migrator can
create tables in it and no other role can.

## Deployment

The lobby chart's [migrate job](../infrastructure/lobby/templates/migrate-job.yaml) runs as a
`pre-install,pre-upgrade` hook. When `nodeConfig.db` is set it runs `node server/db/migrate.js up`,
and if that fails the upgrade stops and the running release is left alone.

The [deploy workflow](../.github/workflows/deploy-lobby.yml) only sets `nodeConfig.db` once the
environment has the database secrets:

| Name                   | Kind     | Notes                          |
| ---------------------- | -------- | ------------------------------ |
| `DB_HOST`              | secret   | Setting this turns Postgres on |
| `DB_USER`              | secret   | The application role           |
| `DB_PASSWORD`          | secret   |                                |
| `DB_MIGRATOR_USER`     | secret   | The migrator role              |
| `DB_MIGRATOR_PASSWORD` | secret   |                                |
| `DB_PORT`              | variable | Defaults to 5432               |
| `DB_DATABASE`          | variable | Defaults to `throneteki`       |

The migrator credentials go into their own Kubernetes secret, which only the migrate job is given,
as `DB_MIGRATOR_USER` and `DB_MIGRATOR_PASSWORD` (mapped onto `db.migrator` by
`config/custom-environment-variables.json5`). The lobby pods never see them.

Production runs PostgreSQL 16. Keep `docker-compose.yml` and the CI `database` job on the same
major version, so migrations are tested against what they'll run on and `schema.sql` is generated
the same way everywhere.
