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
        childItems: [
            { path: '/news', title: 'News', permission: 'canEditNews' },
            { path: '/users', title: 'Users', permission: 'canManageUsers' },
            { path: '/nodes', title: 'Nodes', permission: 'canManageNodes' },
            { path: '/admin/motd', title: 'Motd', permission: 'canManageMotd' },
            { path: '/banlist', title: 'Ban List', permission: 'canManageBanlist' },
            { path: '/events', title: 'Events', permission: 'canManageEvents' }
        ]
    }
];

export const RightMenu = [
    { path: '/login', title: 'Login', showOnlyWhenLoggedOut: true },
    { path: '/register', title: 'Register', showOnlyWhenLoggedOut: true }
];

export const ProfileMenu = [
    { title: 'Profile', path: '/profile' },
    { title: 'Security', path: '/security' },
    { title: 'Block List', path: '/blocklist' },
    { title: 'Logout', path: '/logout' }
];
