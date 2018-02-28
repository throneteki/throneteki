export default function(state = {}, action) {
    switch(action.type) {
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
        case 'SET_AUTH_TOKENS':
            return Object.assign({}, state, {
                token: action.token,
                refreshToken: action.refreshToken
            });
    }

    return state;
}
