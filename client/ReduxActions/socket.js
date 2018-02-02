import io from 'socket.io-client';
import { toastr } from 'react-redux-toastr';

import version from '../../version.js';
import * as actions from '../actions';

export function socketMessageSent(message) {
    return {
        type: 'SOCKET_MESSAGE_SENT',
        message: message
    };
}

export function sendSocketMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        state.lobby.socket.emit(message, ...args);

        return dispatch(socketMessageSent(message));
    };
}

export function sendGameMessage(message, ...args) {
    return (dispatch, getState) => {
        var state = getState();

        if(state.games.socket) {
            state.games.socket.emit('game', message, ...args);
        }

        return dispatch(socketMessageSent(message));
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
    toastr.error('Connection lost', 'You have been disconnected from the lobby server, attempting reconnect..');

    return {
        type: 'LOBBY_DISCONNECTED'
    };
}

export function lobbyReconnected() {
    toastr.success('Reconnected', 'The reconnection to the lobby has been successful');

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
        });

        socket.on('reconnect', () => {
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
            state = getState();
            dispatch(lobbyMessageReceived('gamestate', game, state.auth.username));
        });

        socket.on('cleargamestate', () => {
            dispatch(lobbyMessageReceived('cleargamestate'));
        });

        socket.on('handoff', server => {
            let url = '//' + server.address;
            let standardPorts = [80, 443];

            if(server.port && !standardPorts.some(p => p === server.port)) {
                url += ':' + server.port;
            }

            if(state.games.socket) {
                dispatch(actions.closeGameSocket());
            }

            dispatch(actions.connectGameSocket(url, server.name));
        });
    };
}
