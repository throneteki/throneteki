export function linkPatreon(code) {
    return {
        types: ['ACCOUNT_LINK_REQUEST', 'ACCOUNT_LINK_RESPONSE'],
        shouldCallAPI: () => true,
        APIParams: {
            url: '/api/account/linkPatreon',
            type: 'POST',
            data: JSON.stringify({ code: code }),
            contentType: 'application/json'
        }
    };
}
