export default function(state = {}, action) {
    switch(action.type) {
        case 'REGISTER_ACCOUNT':
            return Object.assign({}, state, {
                registered: false
            });
        case 'ACCOUNT_REGISTERED':
            return Object.assign({}, state, {
                registered: true
            });
        case 'LOGIN_ACCOUNT':
            return Object.assign({}, state, {
                loggedIn: false
            });
        case 'ACCOUNT_LOGGEDIN':
            localStorage.setItem('token', action.response.token);
            localStorage.setItem('refreshToken', JSON.stringify(action.response.refreshToken));

            return Object.assign({}, state, {
                loggedIn: true,
                user: action.response.user,
                token: action.response.token
            });
        case 'ACCOUNT_LOGGEDOUT':
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');

            return Object.assign({}, state, {
                loggedIn: false,
                loggedOut: true,
                user: undefined,
                token: undefined,
                refreshToken: undefined
            });
        case 'RESETPASSWORD_ACCOUNT':
            return Object.assign({}, state, {
                passwordReset: false
            });
        case 'ACCOUNT_PASSWORDRESET':
            return Object.assign({}, state, {
                passwordReset: true
            });
        case 'ACTIVATE_ACCOUNT':
            return Object.assign({}, state, {
                activated: false
            });
        case 'ACCOUNT_ACTIVATED':
            return Object.assign({}, state, {
                activated: true
            });
        case 'ACCOUNT_AUTH_VERIFIED':
            return Object.assign({}, state, {
                loggedIn: true,
                user: action.response.user
            });
    }

    return state;
}
