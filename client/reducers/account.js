export default function(state = {}, action) {
    switch(action.type) {
        case 'REGISTER_ACCOUNT':
            return Object.assign({}, state, {
                registered: false
            });
        case 'ACCOUNT_REGISTERED':
            return Object.assign({}, state, {
                registered: true,
                registeredUser: action.response.user,
                token: action.response.token
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
    }

    return state;
}
