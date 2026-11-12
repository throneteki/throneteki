-- Up Migration

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
        'canViewProblemReports'
    )
);

-- Down Migration

DELETE FROM user_permissions WHERE permission = 'canViewProblemReports';

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
        'canManageBanlist'
    )
);
