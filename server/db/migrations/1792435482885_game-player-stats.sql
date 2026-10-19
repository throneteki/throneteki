-- Up Migration

ALTER TABLE game_players ADD COLUMN stats jsonb;

-- Down Migration

ALTER TABLE game_players DROP COLUMN stats;
