-- Up Migration

CREATE TABLE user_backgrounds (
    user_id bigint PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    token text NOT NULL UNIQUE,
    content_type text NOT NULL,
    image bytea NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Down Migration

DROP TABLE user_backgrounds;
