-- Up Migration

ALTER TABLE users ADD COLUMN email_updates boolean DEFAULT true NOT NULL;

ALTER TABLE game_players ADD COLUMN deck_id bigint REFERENCES decks(id) ON DELETE SET NULL;

CREATE INDEX game_players_deck_id_idx ON game_players (deck_id) WHERE deck_id IS NOT NULL;

CREATE TABLE user_monthly_stats (
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month date NOT NULL,
    version integer NOT NULL,
    data jsonb NOT NULL,
    computed_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, month)
);

CREATE TABLE user_wrapped (
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year integer NOT NULL,
    version integer NOT NULL,
    data jsonb NOT NULL,
    generated_at timestamp with time zone DEFAULT now() NOT NULL,
    emailed_at timestamp with time zone,
    PRIMARY KEY (user_id, year)
);

-- Down Migration

DROP TABLE user_wrapped;

DROP TABLE user_monthly_stats;

DROP INDEX game_players_deck_id_idx;

ALTER TABLE game_players DROP COLUMN deck_id;

ALTER TABLE users DROP COLUMN email_updates;
