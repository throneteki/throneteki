export function login(user, token, isAdmin) {
    return {
        type: 'AUTH_LOGIN',
        user: user,
        token: token,
        isAdmin: isAdmin
    };
}

export function logout() {
    return {
        type: 'AUTH_LOGOUT'
    };
}

export function setAuthToken(token) {
    return {
        type: 'SET_AUTH_TOKEN',
        token: token
    };
}
