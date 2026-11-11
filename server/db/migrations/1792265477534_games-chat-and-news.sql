-- Up Migration

CREATE TABLE games (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    game_id text UNIQUE,
    event_name text,
    started_at timestamptz,
    finished_at timestamptz,
    winners text[] NOT NULL DEFAULT '{}',
    win_reason text,
    game_type text,
    legacy jsonb
);

CREATE INDEX games_started_at_idx ON games (started_at);

CREATE TABLE game_players (
    game_id bigint NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    position integer NOT NULL,
    name text NOT NULL,
    user_id bigint REFERENCES users (id) ON DELETE SET NULL,
    faction text,
    agendas text[] NOT NULL DEFAULT '{}',
    power integer,
    eliminated boolean NOT NULL DEFAULT false,
    details jsonb NOT NULL DEFAULT '{}',
    PRIMARY KEY (game_id, position)
);

CREATE INDEX game_players_user_id_idx ON game_players (user_id);

CREATE TABLE messages (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    user_id bigint REFERENCES users (id) ON DELETE SET NULL,
    poster jsonb NOT NULL,
    message text,
    posted_at timestamptz NOT NULL DEFAULT now(),
    deleted boolean NOT NULL DEFAULT false,
    deleted_by text
);

CREATE INDEX messages_posted_at_idx ON messages (posted_at DESC);

CREATE TABLE motd (
    id boolean PRIMARY KEY DEFAULT true CHECK (id),
    poster jsonb,
    message text,
    motd_type text,
    posted_at timestamptz
);

CREATE TABLE news (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    poster text,
    text text NOT NULL,
    published_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX news_published_at_idx ON news (published_at DESC);

-- Down Migration

DROP TABLE news;
DROP TABLE motd;
DROP TABLE messages;
DROP TABLE game_players;
DROP TABLE games;
