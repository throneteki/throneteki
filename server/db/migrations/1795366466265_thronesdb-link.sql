-- Up Migration

ALTER TABLE users ADD COLUMN IF NOT EXISTS thronesdb jsonb;

ALTER TABLE decks ADD COLUMN IF NOT EXISTS thronesdb_uuid text;

CREATE UNIQUE INDEX IF NOT EXISTS decks_user_id_thronesdb_uuid_key ON decks (user_id, thronesdb_uuid)
    WHERE thronesdb_uuid IS NOT NULL;

-- Down Migration

DROP INDEX decks_user_id_thronesdb_uuid_key;

ALTER TABLE decks DROP COLUMN thronesdb_uuid;

ALTER TABLE users DROP COLUMN thronesdb;
