-- Up Migration

CREATE TABLE banners (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title text NOT NULL,
    link_url text,
    event_id bigint REFERENCES events (id) ON DELETE SET NULL,
    event_date date,
    show_from timestamp with time zone NOT NULL,
    show_until timestamp with time zone NOT NULL,
    image_token text UNIQUE,
    image_content_type text,
    image bytea,
    created_by text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT banners_window_check CHECK (show_until > show_from),
    CONSTRAINT banners_image_check CHECK (
        (image IS NULL AND image_token IS NULL AND image_content_type IS NULL)
        OR (image IS NOT NULL AND image_token IS NOT NULL AND image_content_type IS NOT NULL)
    )
);

CREATE INDEX banners_show_until_idx ON banners (show_until);

ALTER TABLE user_permissions DROP CONSTRAINT user_permissions_permission_check;

ALTER TABLE user_permissions ADD CONSTRAINT user_permissions_permission_check CHECK (
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
        'canManageBanlist',
        'canManageProblemReports',
        'canManageBanners'
    )
);

-- Down Migration

DELETE FROM user_permissions WHERE permission = 'canManageBanners';

ALTER TABLE user_permissions DROP CONSTRAINT user_permissions_permission_check;

ALTER TABLE user_permissions ADD CONSTRAINT user_permissions_permission_check CHECK (
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
        'canManageBanlist',
        'canManageProblemReports'
    )
);

DROP TABLE banners;
