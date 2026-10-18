-- Up Migration

CREATE TABLE users (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mongo_id text UNIQUE,

    username text NOT NULL CHECK (username <> ''),
    email text CHECK (email <> ''),
    email_domain text,
    password text,
    registered_at timestamptz NOT NULL DEFAULT now(),
    verified boolean NOT NULL DEFAULT false,
    disabled boolean NOT NULL DEFAULT false,
    enable_gravatar boolean NOT NULL DEFAULT false,

    settings jsonb NOT NULL DEFAULT '{}',
    prompted_action_windows jsonb NOT NULL DEFAULT '{}',
    patreon jsonb,

    activation_token_hash text,
    activation_token_expires_at timestamptz,
    activation_token_issued_at timestamptz,
    reset_token_hash text,
    reset_token_expires_at timestamptz,
    reset_token_issued_at timestamptz,

    register_ip inet,
    register_ip_normalized inet,
    register_subnet cidr,
    last_login_ip inet,
    last_login_subnet cidr,
    signup_fingerprint_hash text,

    risk_score integer NOT NULL DEFAULT 0,
    risk_flags text[] NOT NULL DEFAULT '{}',
    trust_state text NOT NULL DEFAULT 'trusted'
        CHECK (trust_state IN ('trusted', 'new', 'restricted', 'banned_evasion_review')),
    restricted_until timestamptz,
    evasion_review_required boolean NOT NULL DEFAULT false,
    ban_reason text,
    mod_notes text,

    legacy jsonb
);

CREATE UNIQUE INDEX users_username_key ON users (lower(username));
CREATE UNIQUE INDEX users_email_key ON users (lower(email));

CREATE INDEX users_register_ip_idx ON users (register_ip);
CREATE INDEX users_register_ip_normalized_idx ON users (register_ip_normalized);
CREATE INDEX users_register_subnet_idx ON users (register_subnet);
CREATE INDEX users_last_login_ip_idx ON users (last_login_ip);
CREATE INDEX users_last_login_subnet_idx ON users (last_login_subnet);
CREATE INDEX users_signup_fingerprint_hash_idx ON users (signup_fingerprint_hash);

CREATE INDEX users_unverified_activation_idx ON users (activation_token_expires_at) WHERE NOT verified;

CREATE TABLE user_permissions (
    user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    permission text NOT NULL CHECK (
        permission IN (
            'isAdmin',
            'isContributor',
            'isSupporter',
            'canEditNews',
            'canManageUsers',
            'canManagePermissions',
            'canManageGames',
            'canManageNodes',
            'canModerateChat',
            'canManageMotd',
            'canManageEvents',
            'canManageBanlist'
        )
    ),
    PRIMARY KEY (user_id, permission)
);

CREATE INDEX user_permissions_permission_idx ON user_permissions (permission);

CREATE TABLE refresh_tokens (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_id text NOT NULL UNIQUE,
    token text NOT NULL,
    expires_at timestamptz NOT NULL,
    ip inet,
    last_used_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN refresh_tokens.token_id IS 'Part of the HMAC input for token, and the id clients hold. Tokens from MongoDB keep their ObjectId here so existing sessions stay valid';

CREATE INDEX refresh_tokens_user_id_idx ON refresh_tokens (user_id);
CREATE INDEX refresh_tokens_ip_idx ON refresh_tokens (ip);

CREATE TABLE user_blocks (
    user_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    blocked_username text NOT NULL CHECK (blocked_username = lower(blocked_username)),
    PRIMARY KEY (user_id, blocked_username)
);

-- Down Migration

DROP TABLE user_blocks;
DROP TABLE refresh_tokens;
DROP TABLE user_permissions;
DROP TABLE users;
