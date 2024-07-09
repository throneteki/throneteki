/* global window */

import { io } from 'socket.io-client';
import {
    lobbyConnected,
    lobbyConnectionFailed,
    lobbyDisconnected,
    lobbyReconnecting,
    receiveNewUser,
    receiveUserLeft,
    receiveUsers,
    receiveBanner,
    receiveClearGameState,
    receiveGameState,
    receiveGames,
    receiveLobbyChat,
    receiveMotd,
    receiveNewGame,
    receiveNoChat,
    receivePasswordError,
    receiveRemoveGame,
    receiveRemoveMessage,
    receiveUpdateGame,
    startConnecting,
    receiveLobbyMessages,
    sendNewGameMessage,
    sendSelectDeckMessage,
    sendLeaveGameMessage,
    sendStartGameMessage,
    receiveGameError,
    sendChatMessage,
    sendClearUserSessions,
    sendGetNodeStausMessage,
    sendToggleNodeMessage,
    sendRestartNodeMessage,
    sendMotdMessage,
    receiveHandoff
} from '../reducers/lobby';
import { receiveNodeStatus } from '../reducers/admin';
import { setAuthTokens } from '../reducers/auth';
import { startGameConnecting } from '../reducers/game';

const LobbyMessage = Object.freeze({
    ClearGameState: 'cleargamestate',
    GameError: 'gameerror',
    GameState: 'gamestate',
    HandOff: 'handoff',
    LeaveGame: 'leavegame',
    LobbyChat: 'lobbychat',
    LobbyMessages: 'lobbymessages',
    NewGame: 'newgame',
    NewUserMessage: 'newuser',
    NoChat: 'nochat',
    PongMessage: 'pong',
    UpdateGame: 'updategame',
    UserLeftMessage: 'userleft',
    UsersMessage: 'users',
    RemoveLobbyMessage: 'removelobbymessage',
    RemoveMessage: 'removemessage',
    RemoveGame: 'removegame',
    RemoveGames: 'removegames',
    SelectDeck: 'selectdeck',
    StartGame: 'startgame',
    JoinGame: 'joingame',
    Games: 'games',
    PasswordError: 'passworderror',
    Banner: 'banner',
    Chat: 'chat',
    ClearSessions: 'clearsessions',
    GetNodeStatus: 'getnodestatus',
    ToggleNode: 'togglenode',
    RestartNode: 'restartnode',
    NodeStatus: 'nodestatus',
    Motd: 'motd'
});

const LobbyEvent = Object.freeze({
    Connected: 'connect',
    Disconnected: 'disconnect',
    Reconnecting: 'reconnect',
    Error: 'error'
});

const lobbyMiddleware = (store) => {
    let socket;

    return (next) => (action) => {
        const isConnectionEstablished = socket && store.getState().lobby.connected;
        const dispatch = store.dispatch;

        if (startConnecting.match(action)) {
            if (socket) {
                socket.disconnect();
                socket = null;
            }

            socket = io(window.location.origin, {
                reconnectionDelayMax: 10000,
                auth: {
                    token: store.getState().auth.token
                },
                query: {
                    version: import.meta.env.VITE_VERSION || 'Local build'
                }
            });

            socket.on(LobbyEvent.Connected, () => {
                dispatch(lobbyConnected());
            });

            socket.on(LobbyEvent.Disconnected, () => {
                dispatch(lobbyDisconnected());
            });

            socket.on(LobbyEvent.Reconnecting, () => {
                dispatch(lobbyReconnecting());
            });

            socket.io.on(LobbyEvent.Error, () => {
                dispatch(lobbyConnectionFailed());
            });

            socket.on(LobbyMessage.Games, (games) => {
                dispatch(receiveGames(games));
            });

            socket.on(LobbyMessage.NewGame, (game) => {
                dispatch(receiveNewGame(game));
            });

            socket.on(LobbyMessage.RemoveGame, (game) => {
                dispatch(receiveRemoveGame(game));
            });

            socket.on(LobbyMessage.UpdateGame, (game) => {
                dispatch(receiveUpdateGame(game));
            });

            socket.on(LobbyMessage.UsersMessage, (users) => {
                dispatch(receiveUsers(users));
            });

            socket.on(LobbyMessage.NewUserMessage, (user) => {
                dispatch(receiveNewUser(user));
            });

            socket.on(LobbyMessage.UserLeftMessage, (user) => {
                dispatch(receiveUserLeft(user));
            });

            socket.on(LobbyMessage.PasswordError, (error) => {
                dispatch(receivePasswordError(error));
            });

            socket.on(LobbyMessage.LobbyChat, (message) => {
                dispatch(receiveLobbyChat(message));
            });

            socket.on(LobbyMessage.LobbyMessages, (messages) => {
                dispatch(receiveLobbyMessages(messages));
            });

            socket.on(LobbyMessage.NoChat, () => {
                dispatch(receiveNoChat());
            });

            socket.on(LobbyMessage.RemoveMessage, (messageId) => {
                dispatch(receiveRemoveMessage(messageId));
            });

            socket.on(LobbyMessage.Banner, (message) => {
                dispatch(receiveBanner(message));
            });

            socket.on(LobbyMessage.Motd, (message) => {
                dispatch(receiveMotd(message));
            });

            socket.on(LobbyMessage.ClearGameState, () => {
                dispatch(receiveClearGameState());
            });

            socket.on(LobbyMessage.GameError, (error) => {
                dispatch(receiveGameError(error));
            });

            socket.on(LobbyMessage.GameState, (gameState) => {
                dispatch(receiveGameState(gameState, store.getState().auth.user?.username));
            });

            socket.on(LobbyMessage.NodeStatus, (status) => {
                dispatch(receiveNodeStatus(status));
            });

            socket.on(LobbyMessage.Motd, (message) => {
                dispatch(receiveMotd(message));
            });

            socket.on(LobbyMessage.HandOff, (details) => {
                let url = '//' + details.address;
                let standardPorts = [80, 443];
                let state = store.getState();

                dispatch(receiveHandoff(details));

                if (details.port && !standardPorts.some((p) => p === details.port)) {
                    url += ':' + details.port;
                }

                dispatch(setAuthTokens(details.authToken, state.auth.refreshToken));

                if (state.game.connected && state.game.gameId !== details.gameId) {
                    //dispatch(closeGameSocket());
                }

                dispatch(startGameConnecting(url, details.name));
            });
        }

        if (!isConnectionEstablished || !socket) {
            next(action);

            return;
        }

        if (sendNewGameMessage.match(action)) {
            socket.emit(LobbyMessage.NewGame, action.payload);
        } else if (sendSelectDeckMessage.match(action)) {
            socket.emit(LobbyMessage.SelectDeck, action.payload.gameId, action.payload.deckId);
        } else if (sendLeaveGameMessage.match(action)) {
            socket.emit(LobbyMessage.LeaveGame, action.payload);
        } else if (sendStartGameMessage.match(action)) {
            socket.emit(LobbyMessage.StartGame, action.payload);
        } else if (sendChatMessage.match(action)) {
            socket.emit(LobbyMessage.Chat, action.payload);
        } else if (sendClearUserSessions.match(action)) {
            socket.emit(LobbyMessage.ClearSessions, action.payload);
        } else if (sendGetNodeStausMessage.match(action)) {
            socket.emit(LobbyMessage.GetNodeStatus);
        } else if (sendToggleNodeMessage.match(action)) {
            socket.emit(LobbyMessage.ToggleNode, action.payload);
        } else if (sendRestartNodeMessage.match(action)) {
            socket.emit(LobbyMessage.RestartNode, action.payload);
        } else if (sendMotdMessage.match(action)) {
            socket.emit(LobbyMessage.Motd, action.payload);
        }

        next(action);
    };
};

export default lobbyMiddleware;
