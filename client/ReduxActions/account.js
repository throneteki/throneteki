import $ from 'jquery';

export function registerAccount(user) {
    return {
        types: ['REGISTER_ACCOUNT', 'ACCOUNT_REGISTERED'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: '/api/account/register',
            type: 'POST',
            data: JSON.stringify({ username: user.username, password: user.password, email: user.email }),
            contentType: 'application/json'
        })
    };
}

export function loginAccount(auth) {
    return {
        types: ['LOGIN_ACCOUNT', 'ACCOUNT_LOGGEDIN'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: '/api/account/login',
            type: 'POST',
            data: JSON.stringify({ username: auth.username, password: auth.password }),
            contentType: 'application/json'
        })
    };
}
