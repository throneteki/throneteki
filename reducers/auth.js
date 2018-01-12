export default function(state = {}, action) {
    switch(action.type) {
        case 'AUTH_LOGIN':
            return Object.assign({}, state, {
                user: action.user,
                username: action.user.username,
                token: action.token,
                isAdmin: action.isAdmin,
                loggedIn: true
            });
        case 'AUTH_LOGOUT':
            return Object.assign({}, state, {
                user: undefined,
                username: undefined,
                token: undefined,
                isAdmin: false,
                loggedIn: false
            });
        case 'REFRESH_USER':
            return Object.assign({}, state, {
                user: action.user,
                username: action.user.username,
                token: action.token
            });
        case 'BLOCKLIST_ADDED':
        case 'BLOCKLIST_DELETED':
            return Object.assign({}, state, {
                user: action.response.user,
                username: action.response.user.username,
                token: action.response.token
            });
    }

    return state;
}
