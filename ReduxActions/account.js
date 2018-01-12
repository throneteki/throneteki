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

export function forgotPassword(details) {
    return {
        types: ['FORGOTPASSWORD_ACCOUNT', 'ACCOUNT_FORGOTPASSWORD'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: '/api/account/password-reset',
            type: 'POST',
            data: JSON.stringify({ username: details.username, captcha: details.captcha }),
            contentType: 'application/json'
        })
    };
}

export function resetPassword(details) {
    return {
        types: ['RESETPASSWORD_ACCOUNT', 'ACCOUNT_PASSWORDRESET'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: '/api/account/password-reset-finish',
            type: 'POST',
            data: JSON.stringify({ id: details.id, token: details.token, newPassword: details.newPassword }),
            contentType: 'application/json'
        })
    };
}

export function activateAccount(details) {
    return {
        types: ['ACTIVATE_ACCOUNT', 'ACCOUNT_ACTIVATED'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax({
            url: '/api/account/activate',
            type: 'POST',
            data: JSON.stringify({ id: details.id, token: details.token }),
            contentType: 'application/json'
        })
    };
}
