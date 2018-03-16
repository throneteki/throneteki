const menus = [
    { path: '/login', title: 'Login', showOnlyWhenLoggedOut: true, position: 'right' },
    { path: '/logout', title: 'Logout', showOnlyWhenLoggedIn: true, position: 'right' },
    { path: '/register', title: 'Register', showOnlyWhenLoggedOut: true, position: 'right' },
    { path: '/decks', title: 'Login', showOnlyWhenLoggedOut: true, position: 'left' },
    { path: '/play', title: 'Play', position: 'left' },
    { title: 'Help', position: 'left', childItems: [
        { path: '/how-to-play', title: 'How To Play' },
        { path: '/about', title: 'About' }
    ]},
    { path: '/profile', title: 'Profile', childItems: [

    ] },
    { path: '/news', action: () => <NewsAdmin />, permission: 'canEditNews' },
    { path: '/security', action: () => <Security /> },
    { path: '/activation', action: context => <Activation id={ context.params.id } token={ context.params.token } /> },
    { path: '/blocklist', action: () => <BlockList /> },
    { path: '/users', action: () => <UserAdmin />, permission: 'canManageUsers' }
];
