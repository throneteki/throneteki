-- Up Migration

CREATE TABLE cards (
    code text PRIMARY KEY,
    data jsonb NOT NULL
);

CREATE TABLE packs (
    code text PRIMARY KEY,
    data jsonb NOT NULL
);

CREATE TABLE events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    name text NOT NULL,
    format text,
    variant text,
    legality jsonb,
    custom_legality jsonb,
    game_type text,
    lock_decks boolean NOT NULL DEFAULT false,
    use_event_game_options boolean NOT NULL DEFAULT false,
    event_game_options jsonb,
    valid_table_creators text[],
    valid_spectators text[],
    legacy jsonb
);

CREATE TABLE draft_cubes (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    name text NOT NULL,
    pack_definitions jsonb NOT NULL DEFAULT '[]',
    starter_deck jsonb,
    last_updated timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE decks (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    user_id bigint REFERENCES users (id) ON DELETE CASCADE,
    standalone_deck_id text UNIQUE,
    name text NOT NULL,
    format text,
    variant text,
    faction_code text NOT NULL,
    agenda_code text,
    event_id bigint REFERENCES events (id) ON DELETE SET NULL,
    is_favourite boolean NOT NULL DEFAULT false,
    last_updated timestamptz NOT NULL DEFAULT now(),
    CHECK ((user_id IS NULL) <> (standalone_deck_id IS NULL))
);

CREATE INDEX decks_user_id_last_updated_idx ON decks (user_id, last_updated DESC);
CREATE INDEX decks_event_id_idx ON decks (event_id);
CREATE UNIQUE INDEX decks_user_id_event_id_key ON decks (user_id, event_id) WHERE event_id IS NOT NULL;

CREATE TABLE deck_cards (
    deck_id bigint NOT NULL REFERENCES decks (id) ON DELETE CASCADE,
    section text NOT NULL CHECK (section IN ('plot', 'draw', 'banner', 'pool')),
    position integer NOT NULL,
    card_code text NOT NULL,
    count integer NOT NULL DEFAULT 1 CHECK (count > 0),
    PRIMARY KEY (deck_id, section, position)
);

-- Down Migration

DROP TABLE deck_cards;
DROP TABLE decks;
DROP TABLE draft_cubes;
DROP TABLE events;
DROP TABLE packs;
DROP TABLE cards;
