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
            return Object.assign({}, state, {
                loggedIn: true,
                loggedInUser: action.response.user,
                token: action.response.token
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
    }

    return state;
}
