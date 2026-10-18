-- Up Migration

CREATE TABLE banlist (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    ip text NOT NULL UNIQUE,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE abuse_blocks (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    scope text NOT NULL CHECK (scope IN ('ip', 'subnet', 'fingerprint', 'email_domain')),
    value text NOT NULL,
    reason text,
    source_user_id bigint REFERENCES users (id) ON DELETE SET NULL,
    created_by text,
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz,
    active boolean NOT NULL DEFAULT true,
    deactivated_at timestamptz
);

CREATE INDEX abuse_blocks_scope_value_idx ON abuse_blocks (scope, value) WHERE active;

CREATE TABLE abuse_events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,
    type text NOT NULL,
    username text,
    user_id bigint REFERENCES users (id) ON DELETE SET NULL,
    ip inet,
    subnet cidr,
    fingerprint_hash text,
    email_domain text,
    outcome text NOT NULL DEFAULT 'allowed',
    signals text[] NOT NULL DEFAULT '{}',
    score_delta integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by text
);

CREATE INDEX abuse_events_type_created_at_idx ON abuse_events (type, created_at);
CREATE INDEX abuse_events_username_idx ON abuse_events (username);
CREATE INDEX abuse_events_user_id_idx ON abuse_events (user_id);

-- Down Migration

DROP TABLE abuse_events;
DROP TABLE abuse_blocks;
DROP TABLE banlist;
