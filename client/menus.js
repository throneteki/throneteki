const menus = [
    { path: '/login', title: 'Login', showOnlyWhenLoggedOut: true, position: 'right' },
    { path: '/register', title: 'Register', showOnlyWhenLoggedOut: true, position: 'right' },
    { path: '/decks', title: 'Decks', showOnlyWhenLoggedIn: true, position: 'left' },
    { path: '/play', title: 'Play', position: 'left' },
    {
        title: 'Help', position: 'left', childItems: [
            { path: '/how-to-play', title: 'How To Play' },
            { path: '/about', title: 'About' }
        ]
    },
    {
        title: '%CURRENTUSER%',
        childItems: [
            { title: 'Profile', path: '/profile' },
            { title: 'Security', path: '/security' },
            { title: 'Block List', path: '/blocklist' },
            { title: 'Logout', path: '/logout' }
        ],
        showOnlyWhenLoggedIn: true,
        position: 'right',
        showProfilePicture: true
    },
    {
        title: 'Admin',
        showOnlyWhenLoggedIn: true,
        childItems: [
            { path: '/news', title: 'News', permission: 'canEditNews' },
            { path: '/users', title: 'Users', permission: 'canManageUsers' }
        ], position: 'left'
    }
];

export default menus;
