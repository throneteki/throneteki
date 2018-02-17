function games(state = {}, action) {
    switch(action.type) {
        case 'START_NEWGAME':
            return Object.assign({}, state, {
                newGame: true
            });
        case 'CANCEL_NEWGAME':
            return Object.assign({}, state, {
                newGame: false
            });
        case 'GAME_SOCKET_CONNECTED':
            return Object.assign({}, state, {
                socket: action.socket,
                connecting: false,
                connected: true
            });
        case 'GAME_SOCKET_CONNECTING':
            return Object.assign({}, state, {
                connecting: true,
                connected: false,
                gameHost: action.host
            });
        case 'GAME_SOCKET_CONNECT_FAILED':
            return Object.assign({}, state, {
                connecting: false,
                connected: false,
                gameHost: undefined
            });
        case 'GAME_SOCKET_DISCONNECTED':
            return Object.assign({}, state, {
                connecting: false,
                connected: false
            });
        case 'GAME_SOCKET_RECONNECTING':
            return Object.assign({}, state, {
                connecting: true,
                connected: false
            });
        case 'GAME_SOCKET_RECONNECTED':
            return Object.assign({}, state, {
                connecting: false,
                connected: true
            });
        case 'GAME_SOCKET_CLOSED':
            return Object.assign({}, state, {
                connected: false,
                connecting: false,
                gameHost: undefined,
                newGame: false,
                socket: undefined
            });
        default:
            return state;
    }
}

export default games;
