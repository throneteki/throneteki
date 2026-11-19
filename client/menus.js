export const AdminSections = [
    { key: 'news', path: '/news', title: 'News', permission: 'canEditNews' },
    { key: 'users', path: '/users', title: 'Users', permission: 'canManageUsers' },
    { key: 'nodes', path: '/nodes', title: 'Nodes', permission: 'canManageNodes' },
    {
        key: 'reports',
        path: '/admin/problem-reports',
        title: 'Problem Reports',
        permission: 'canManageProblemReports'
    },
    { key: 'motd', path: '/admin/motd', title: 'MOTD', permission: 'canManageMotd' },
    { key: 'banners', path: '/admin/banners', title: 'Banners', permission: 'canManageBanners' },
    { key: 'banlist', path: '/banlist', title: 'Ban List', permission: 'canManageBanlist' },
    { key: 'events', path: '/events', title: 'Events', permission: 'canManageEvents' }
];

export const LeftMenu = [
    { path: '/decks', title: 'Decks', showOnlyWhenLoggedIn: true },
    { path: '/play', title: 'Play' },
    {
        title: 'Help',
        childItems: [
            { path: '/how-to-play', title: 'How To Play' },
            { path: '/about', title: 'About' },
            { path: '/privacy', title: 'Privacy Policy' }
        ]
    },
    {
        title: 'Admin',
        showOnlyWhenLoggedIn: true,
        childItems: AdminSections
    }
];

export const RightMenu = [
    { path: '/login', title: 'Login', showOnlyWhenLoggedOut: true },
    { path: '/register', title: 'Register', showOnlyWhenLoggedOut: true }
];

export const ProfileMenu = [
    { title: 'Profile', path: '/profile' },
    { title: 'Stats', path: '/stats' },
    { title: 'Logout', path: '/logout' }
];
