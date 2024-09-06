import io from 'socket.io-client';

import * as actions from '../actions';

export function receiveGameState(game, username) {
    return (dispatch, getState) => {
        let state = getState();
        let user = state.account.user;
        let previousGameState = state.lobby.currentGame;

        if (user && previousGameState) {
            if (
                hasTimer(game, user.username) &&
                !hasTimer(previousGameState, user.username) &&
                user.settings.windowTimer !== 0
            ) {
                let timerProps = game.players[user.username].buttons.find((button) => button.timer);
                dispatch(actions.startAbilityTimer(user.settings.windowTimer, timerProps));
            } else if (
                !hasTimer(game, user.username) &&
                hasTimer(previousGameState, user.username)
            ) {
                dispatch(actions.stopAbilityTimer());
            }
        }

        dispatch({
            type: 'LOBBY_MESSAGE_RECEIVED',
            message: 'gamestate',
            args: [game, username]
        });
    };
}

function hasTimer(game, username) {
    let player = game.players[username];
    let buttons = (player && player.buttons) || [];
    return buttons.some((button) => button.timer);
}

export function clearGameState() {
    return {
        type: 'CLEAR_GAMESTATE'
    };
}

export function gameSocketConnecting(host, socket) {
    return {
        type: 'GAME_SOCKET_CONNECTING',
        host: host,
        socket: socket
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

export function gameSocketDisconnected() {
    return {
        type: 'GAME_SOCKET_DISCONNECTED'
    };
}

export function gameSocketReconnecting() {
    return {
        type: 'GAME_SOCKET_RECONNECTING'
    };
}

export function gameSocketReconnected() {
    return {
        type: 'GAME_SOCKET_RECONNECTED'
    };
}

export function gameSocketConnectFailed() {
    return {
        type: 'GAME_SOCKET_CONNECT_FAILED'
    };
}

export function connectGameSocket(url, name) {
    return (dispatch, getState) => {
        let state = getState();

        let gameSocket = io.connect(url, {
            path: '/' + name + '/socket.io',
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            query: state.auth.token ? 'token=' + state.auth.token : undefined
        });

        dispatch(gameSocketConnecting(url + '/' + name, gameSocket));

        gameSocket.on('connect', () => {
            dispatch(gameSocketConnected(gameSocket));
        });

        gameSocket.on('connect_error', (err) => {
            if (state.lobby.socket) {
                state.lobby.socket.emit('connectfailed');
            }

            dispatch(gameSocketConnectError(err));
        });

        gameSocket.on('disconnect', () => {
            dispatch(gameSocketDisconnected(gameSocket.gameClosing));
        });

        gameSocket.on('reconnecting', (attemptNumber) => {
            dispatch(gameSocketReconnecting(attemptNumber));
        });

        gameSocket.on('reconnect', () => {
            dispatch(gameSocketReconnected());
        });

        gameSocket.on('reconnect_failed', () => {
            dispatch(gameSocketConnectFailed());
        });

        gameSocket.on('gamestate', (game) => {
            dispatch(
                receiveGameState(game, state.account.user ? state.account.user.username : undefined)
            );
        });

        gameSocket.on('cleargamestate', () => {
            dispatch(clearGameState());
        });
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
