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
        case 'ACCOUNT_LOGGEDIN':
            localStorage.setItem('refreshToken', JSON.stringify(action.response.refreshToken));

            return Object.assign({}, state, {
                token: action.response.token,
                refreshToken: action.response.refreshToken
            });
        case 'ACCOUNT_LOGGEDOUT':
            return Object.assign({}, state, {
                token: undefined,
                refreshToken: undefined
            });
        case 'SET_AUTH_TOKENS':
            localStorage.setItem('token', action.token);
            if(action.refreshToken) {
                localStorage.setItem('refreshToken', JSON.stringify(action.refreshToken));
            }

            return Object.assign({}, state, {
                token: action.token,
                refreshToken: action.refreshToken
            });
    }

    return state;
}
