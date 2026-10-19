# Database

The lobby stores everything in PostgreSQL, configured by `db`. It used MongoDB until October 2026
(see [The move from MongoDB](#the-move-from-mongodb)).

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

## Services

| Service            | Tables                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| `UserService`      | `users`, `user_permissions`, `refresh_tokens`, `user_blocks`               |
| `AbuseService`     | `abuse_blocks`, `abuse_events`, `banlist`, and users through `UserService` |
| `BanlistService`   | `banlist`                                                                  |
| `CardService`      | `cards`, `packs`                                                           |
| `DeckService`      | `decks`, `deck_cards`                                                      |
| `EventService`     | `events`                                                                   |
| `DraftCubeService` | `draft_cubes`                                                              |
| `GameService`      | `games`, `game_players`                                                    |
| `MessageService`   | `messages`, `motd`                                                         |
| `NewsService`      | `news`                                                                     |

The services return the same shapes the MongoDB versions did, so the models, API responses and
client didn't change when they moved. Things worth knowing when working with them:

- **ids are numeric strings.** `_id` is the row id as a string, so it passes the same
  `typeof === 'string'` checks a MongoDB ObjectId did. Lookups by id also accept a 24 character
  ObjectId and find the row by `mongo_id`, for links, sessions and auth tokens from before the move.
- **decks are card pointers.** Card lists are stored as code and count in `deck_cards`, and come
  back as `{ cardcode, count }` (banners as codes). Factions are stored as their code.
- **missing fields stay missing.** Columns that are NULL are left off the returned objects, as
  those fields were missing from the MongoDB documents.
- **ips and subnets are normalised.** Postgres stores IPv6 subnets compressed
  (`2001:0db8:0000:0000::/64` reads back as `2001:db8::/64`), so compare them in SQL, where they
  compare as addresses, not as strings in JavaScript. `UserService.findLinkedUsers` does this.
  Values that aren't a valid ip or subnet are stored as missing.
- **permissions are checked.** Permissions not in the `user_permissions` constraint are dropped
  with a warning instead of being stored.
- **usernames and emails are unique, ignoring case.** Registration checks first, and if two
  registrations race, the second gets the same "already exists" message from the unique index.

## Integration tests

Tests that need a database live under
[test/server/db-integration/](../test/server/db-integration) and run with `npm run test:db`,
not `npm test`. That applies the migrations and runs the tests against `throneteki_test`
(`config/test.json5`). Every test empties the tables, so the tests refuse to run against a
database whose name doesn't end in `_test`.

```sh
docker compose exec postgres createdb -U throneteki throneteki_test   # once
npm run test:db
```

The CI `database` job runs them on every push and pull request.

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
   already in Postgres. Anything that needs another system is a script under `server/scripts`.

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
CREATE DATABASE throneteki OWNER throneteki_migrator ENCODING 'UTF8' TEMPLATE template0;

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
create tables in it and no other role can. The database must be UTF8: card text and chat contain
characters other encodings can't store.

## Deployment

The lobby chart's [migrate job](../infrastructure/lobby/templates/migrate-job.yaml) runs
`node server/db/migrate.js up` as a `pre-install,pre-upgrade` hook. If it fails, the upgrade
stops and the running release is left alone.

The [deploy workflow](../.github/workflows/deploy-lobby.yml) needs these on the GitHub
environment:

| Name                   | Kind     | Notes                    |
| ---------------------- | -------- | ------------------------ |
| `DB_HOST`              | secret   |                          |
| `DB_USER`              | secret   | The application role     |
| `DB_PASSWORD`          | secret   |                          |
| `DB_MIGRATOR_USER`     | secret   | The migrator role        |
| `DB_MIGRATOR_PASSWORD` | secret   |                          |
| `DB_PORT`              | variable | Defaults to 5432         |
| `DB_DATABASE`          | variable | Defaults to `throneteki` |

The migrate job reads its config and the migrator credentials from `throneteki-migrate-secret`,
which is created as a hook just before it. It can't use `throneteki-lobby-secret`, because Helm
only updates that after the pre-upgrade hooks have run. The credentials reach the job as
`DB_MIGRATOR_USER` and `DB_MIGRATOR_PASSWORD` (mapped onto `db.migrator` by
`config/custom-environment-variables.json5`); the lobby pods never see them.

Production runs PostgreSQL 16. Keep `docker-compose.yml` and the CI `database` job on the same
major version, so migrations are tested against what they'll run on and `schema.sql` is generated
the same way everywhere.

## The move from MongoDB

Production moved to Postgres on 19 October 2026, copied from MongoDB by a one-off script (removed
afterwards; see the history of `server/scripts/migrate-from-mongo.js`). Every copied row keeps its
ObjectId in `mongo_id`, so old links and refresh tokens still work. Cards and packs weren't copied:
the fetchdata job loads them from the json data.

Some old data couldn't be copied as it was:

- **Duplicate accounts.** Where usernames or emails clashed once case was ignored, the account most
  likely to be in use was kept: the one last used (refresh token, deck saved, game played or chat
  message), then the one used most, then the oldest.
    - Accounts whose username clashed were dropped, about 140. Most came from a 2017 bug where
      trying to register a taken name still created an account (with no password); the rest from
      people submitting the registration form twice.
    - Accounts whose email clashed and which hadn't been used in five years were dropped, about
      1,500. Most date from before July 2017, when registration started allowing one account per
      email.
    - Accounts whose email clashed but which had been used in the last five years were kept
      without their email, which is in `legacy.removedDuplicateEmail`.
    - Decks belonging to dropped accounts were dropped with them, as were decks whose owner no
      longer existed.
- **Impossible card counts** (from the old free-text deck editor) and zero-count entries were
  dropped from decks, as were rookery cards.
- **Impossible player powers** in games, from the `/power` chat command before it was capped at
  99, are stored as missing.
- **Legacy reset and activation tokens**, long expired, were dropped.
