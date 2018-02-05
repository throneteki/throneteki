import io from 'socket.io-client';
import { toastr } from 'react-redux-toastr';

export function receiveGames(games) {
    return {
        type: 'RECEIVE_GAMES',
        games: games
    };
}

export function startNewGame() {
    return {
        type: 'START_NEWGAME'
    };
}

export function cancelNewGame() {
    return {
        type: 'CANCEL_NEWGAME'
    };
}

export function receiveGameState(game, username) {
    return {
        type: 'LOBBY_MESSAGE_RECEIVED',
        message: 'gamestate',
        args: [game, username]
    };
}

export function clearGameState() {
    return {
        type: 'CLEAR_GAMESTATE'
    };
}

export function joinPasswordGame(game, type) {
    return {
        type: 'JOIN_PASSWORD_GAME',
        game: game,
        joinType: type
    };
}

export function receivePasswordError(message) {
    return {
        type: 'RECEIVE_PASSWORD_ERROR',
        message: message
    };
}

export function cancelPasswordJoin() {
    return {
        type: 'CANCEL_PASSWORD_JOIN'
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

export function gameSocketConnectError(err) {
    toastr.error('Connect Error', 'There was an error connecting to the game server: ' + err.message + '(' + err.description + ')');

    return {
        type: 'GAME_SOCKET_CONNECT_ERROR'
    };
}

export function gameSocketDisconnected(socketClosing) {
    if(!socketClosing) {
        toastr.error('Connection lost', 'You have been disconnected from the game server');
    }

    return {
        type: 'GAME_SOCKET_DISCONNECTED'
    };
}

export function gameSocketReconnecting(attemptNumber) {
    toastr.info('Reconnecting', 'Attempt number ' + attemptNumber + ' to reconnect..');

    return {
        type: 'GAME_SOCKET_RECONNECTING'
    };
}

export function gameSocketReconnected() {
    toastr.success('Reconnected', 'The reconnection has been successful');

    return {
        type: 'GAME_SOCKET_RECONNECTED'
    };
}

export function gameSocketConnectFailed() {
    toastr.error('Reconnect failed', 'Given up trying to connect to the server');

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
            if(state.lobby.socket) {
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

        gameSocket.on('gamestate', game => {
            dispatch(receiveGameState(game, state.auth.username));
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

export function closeGameSocket() {
    return (dispatch, getState) => {
        let state = getState();

        if(state.games.socket) {
            state.games.socket.gameClosing = true;
            state.games.socket.close();
        }

        return dispatch(gameSocketClosed());
    };
}

export function gameStarting() {
    return {
        type: 'GAME_STARTING'
    };
}

export function startGame(id) {
    return (dispatch, getState) => {
        let state = getState();

        if(state.lobby.socket) {
            state.lobby.socket.emit('startgame', id);
        }

        return dispatch(gameStarting());
    };
}
