import _ from 'underscore';

export default function(state = {}, action) {
    switch(action.type) {
        case 'REFRESH_USER':
            return Object.assign({}, state, {
                user: action.user,
                username: action.user.username,
                token: action.token
            });
        case 'RECEIVE_BLOCKLIST':
            return Object.assign({}, state, {
                blockList: action.response.blockList
            });
        case 'RECEIVE_SESSIONS':
            return Object.assign({}, state, {
                sessions: action.response.tokens
            });
        case 'REMOVE_SESSION':
            return Object.assign({}, state, {
                sessionRemoved: false
            });
        case 'SESSION_REMOVED':
            var sessions = _.reject(state.sessions, t => {
                return t.id === action.response.tokenId;
            });

            return Object.assign({}, state, {
                sessionRemoved: true,
                sessions: sessions
            });
        case 'BLOCKLIST_ADDED':
            var addedState = Object.assign({}, state, {
                blockListAdded: true
            });

            addedState.blockList.push(action.response.username);

            return addedState;
        case 'BLOCKLIST_DELETED':
            var blockList = _.reject(state.blockList, user => {
                return user === action.response.username;
            });

            return Object.assign({}, state, {
                blockListDeleted: true,
                blockList: blockList
            });
        case 'CLEAR_BLOCKLIST_STATUS':
            return Object.assign({}, state, {
                blockListAdded: false,
                blockListDeleted: false
            });
        case 'CLEAR_SESSION_STATUS':
            return Object.assign({}, state, {
                sessionRemoved: false
            });
    }

    return state;
}
