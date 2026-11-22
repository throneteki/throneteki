-- Up Migration

ALTER TABLE user_permissions DROP CONSTRAINT user_permissions_permission_check;

UPDATE user_permissions
SET permission = 'canManageProblemReports'
WHERE permission = 'canViewProblemReports';

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

-- Down Migration

ALTER TABLE user_permissions DROP CONSTRAINT user_permissions_permission_check;

UPDATE user_permissions
SET permission = 'canViewProblemReports'
WHERE permission = 'canManageProblemReports';

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
