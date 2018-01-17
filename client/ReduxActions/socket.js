import io from 'socket.io-client';

import version from '../../version.js';

export function socketMessageSent(message) {
    return {
        type: 'SOCKET_MESSAGE_SENT',
        message: message
    };
}

export function sendSocketMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        state.socket.socket.emit(message, ...args);

        return dispatch(socketMessageSent(message));
    };
}

export function sendGameMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        if(state.socket.gameSocket) {
            state.socket.gameSocket.emit('game', message, ...args);
        }

        return dispatch(socketMessageSent(message));
    };
}

export function gameSocketConnected(socket) {
    return {
        type: 'GAME_SOCKET_CONNECTED',
        socket: socket
    };
}

export function gameSocketConnectError() {
    return {
        type: 'GAME_SOCKET_CONNECT_ERROR'
    };
}

export function gameSocketDisconnect() {
    return {
        type: 'GAME_SOCKET_DISCONNETED'
    };
}

export function gameSocketReconnecting() {
    return {
        type: 'GAME_SOCKET_RECONNECTED'
    };
}

export function gameSocketConnecting(host) {
    return {
        type: 'GAME_SOCKET_CONNECTING',
        host: host
    };
}

export function gameSocketConnectFailed() {
    return {
        type: 'GAME_SOCKET_CONNECT_FAILED'
    };
}

export function sendGameSocketConnectFailed() {
    return (dispatch, getState) => {
        var state = getState();

        if(state.socket.socket) {
            state.socket.socket.emit('connectfailed');
        }

        return dispatch(gameSocketConnectFailed());
    };
}

export function gameSocketClosed(message) {
    return {
        type: 'GAME_SOCKET_CLOSED',
        message: message
    };
}

export function gameSocketClose() {
    return (dispatch) => {
        return dispatch(gameSocketClosed());
    };
}

export function closeGameSocket() {
    return (dispatch, getState) => {
        let state = getState();

        if(state.socket.gameSocket) {
            state.socket.gameSocket.gameClosing = true;
            state.socket.gameSocket.close();
        }

        return dispatch(gameSocketClosed());
    };
}

export function lobbyConnecting(socket) {
    return {
        type: 'LOBBY_CONNECTING',
        socket: socket
    };
}

export function lobbyConnected(socket) {
    return {
        type: 'LOBBY_CONNECTED',
        socket: socket
    };
}

export function lobbyDisconnected() {
    return {
        type: 'LOBBY_DISCONNECTED'
    };
}

export function lobbyReconnected() {
    return {
        type: 'LOBBY_RECONNECTED'
    };
}

export function lobbyMessageReceived(message, ...args) {
    return {
        type: 'LOBBY_MESSAGE_RECEIVED',
        message: message,
        args
    };
}

export function connectLobby() {
    return (dispatch, getState) => {
        let state = getState();
        let queryString = state.auth.token ? 'token=' + state.auth.token + '&' : '';
        queryString += 'version=' + version;

        let socket = io.connect(window.location.origin, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
            query: queryString
        });

        dispatch(lobbyConnecting(socket));

        socket.on('connect', () => {
            dispatch(lobbyConnected());
        });

        socket.on('disconnect', () => {
            dispatch(lobbyDisconnected());
            //toastr.error('Connection lost', 'You have been disconnected from the lobby server, attempting reconnect..');
        });

        socket.on('reconnect', () => {
            //toastr.success('Reconnected', 'The reconnection to the lobby has been successful');
            dispatch(lobbyReconnected());
        });

        socket.on('games', games => {
            dispatch(lobbyMessageReceived('games', games));
        });

        socket.on('users', users => {
            dispatch(lobbyMessageReceived('users', users));
        });

        socket.on('newgame', game => {
            dispatch(lobbyMessageReceived, 'newgame', game);
        });

        socket.on('passworderror', message => {
            dispatch(lobbyMessageReceived('passworderror', message));
        });

        socket.on('lobbychat', message => {
            dispatch(lobbyMessageReceived('lobbychat', message));
        });

        socket.on('lobbymessages', messages => {
            dispatch(lobbyMessageReceived('lobbymessages', messages));
        });

        socket.on('banner', notice => {
            dispatch(lobbyMessageReceived('banner', notice));
        });

        socket.on('gamestate', game => {
            dispatch(lobbyMessageReceived, 'gamestate', game);
        });

        socket.on('cleargamestate', () => {
            dispatch(lobbyMessageReceived, 'cleargamestate');
        });
    };
}
