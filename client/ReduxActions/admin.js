import $ from 'jquery';

export function findUser(username) {
    return {
        types: ['REQUEST_FINDUSER', 'RECEIVE_FINDUSER'],
        shouldCallAPI: () => true,
        callAPI: () => $.ajax('/api/user/' + username, { cache: false })
    };
}
