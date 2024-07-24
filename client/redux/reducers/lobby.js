import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    games: [],
    users: [],
    messages: [],
    connecting: false,
    connected: false,
    passwordGame: undefined,
    passwordJoinType: undefined,
    passwordError: undefined,
    currentGame: undefined,
    newGame: false,
    lobbyError: false,
    notice: undefined,
    motd: undefined
};

const lobbySlice = createSlice({
    name: 'lobby',
    initialState,
    reducers: (create) => ({
        joinPasswordGame: create.preparedReducer(
            (game, joinType) => {
                return { payload: { game, joinType } };
            },
            (state, action) => {
                state.passwordGame = action.payload.game;
                state.passwordJoinType = action.payload.joinType;
            }
        ),
        cancelPasswordJoin(state) {
            state.passwordGame = undefined;
            state.passwordError = undefined;
            state.passwordJoinType = undefined;
        },
        startNewGame(state) {
            state.newGame = true;
        },
        gameSocketClosed(state) {
            state.currentGame = undefined;
            state.newGame = false;
        },
        cancelNewGame(state) {
            state.newGame = false;
        },
        clearChatStatus(state) {
            state.lobbyError = false;
        },
        startConnecting: (state) => {
            state.connecting = true;
        },
        lobbyConnected: (state) => {
            state.connected = true;
            state.connecting = false;
        },
        lobbyDisconnected: (state) => {
            state.connecting = false;
            state.connected = false;
        },
        lobbyReconnecting: (state) => {
            state.connecting = true;
            state.connected = false;
        },
        lobbyConnectionFailed: (state) => {
            state.connecting = false;
            state.connected = false;
        },
        receiveGames: (state, action) => {
            state.games = action.payload;

            // If our current game disappeared, clear it out
            if (
                state.currentGame &&
                !state.games.some((game) => game.id === state.currentGame.id)
            ) {
                state.currentGame = undefined;
                state.newGame = false;
            }
        },
        receiveNewGame: (state, action) => {
            state.games.push(action.payload[0]);
        },
        receiveRemoveGame: (state, action) => {
            const gameIdsToRemove = new Set(action.payload.map((g) => g.id));
            state.games = state.games.filter((game) => !gameIdsToRemove.has(game.id));
        },
        receiveUpdateGame: (state, action) => {
            const game = action.payload[0];
            const index = state.games.findIndex((g) => g.id === game.id);
            if (index !== -1) {
                state.games[index] = game;
            }
        },
        receiveUsers: (state, action) => {
            state.users = action.payload;
        },
        receiveNewUser: (state, action) => {
            state.users.push(action.payload);
        },
        receiveUserLeft: (state, action) => {
            state.users = state.users.filter((u) => u.username !== action.payload.username);
        },
        receivePasswordError: (state, action) => {
            state.passwordError = action.payload;
        },
        receiveLobbyChat: (state, action) => {
            state.messages.push(action.payload);
        },
        receiveLobbyMessages: (state, action) => {
            state.messages = action.payload;
        },
        receiveNoChat: (state) => {
            state.lobbyError = true;
        },
        receiveRemoveMessage: (state, action) => {
            state.messages = state.messages.filter((message) => message._id !== action.payload);
        },
        receiveBanner: (state, action) => {
            state.notice = action.payload;
        },
        receiveMotd: (state, action) => {
            state.motd = action.payload;
        },
        receiveClearGameState: (state) => {
            state.newGame = false;
            state.currentGame = undefined;
        },
        receiveGameError: (state, action) => {
            state.gameError = action.payload;
        },
        receiveHandoff: (state, action) => {
            state.host = action.payload.host;
        },
        receiveGameState: create.preparedReducer(
            (game, username) => {
                return { payload: { game, username } };
            },
            (state, action) => {
                state.currentGame = action.payload.game;
                const username = action.payload.username;

                if (!state.currentGame) {
                    state.newGame = false;
                    return;
                }

                if (
                    state.currentGame?.spectators.some((spectator) => spectator.name === username)
                ) {
                    return;
                }

                if (
                    !state.currentGame ||
                    !state.currentGame.players[username] ||
                    state.currentGame.players[username].left
                ) {
                    state.currentGame = undefined;
                    state.newGame = false;
                } else if (state.currentGame && !state.currentGame.started) {
                    state.newGame = true;
                }

                if (state.currentGame) {
                    state.passwordGame = undefined;
                    state.passwordJoinType = undefined;
                    state.passwordError = undefined;
                }
            }
        ),
        receiveResponseTime: (state, action) => {
            state.responseTime = action.payload;
        },
        sendNewGameMessage: () => {},
        sendSelectDeckMessage: create.preparedReducer(
            (gameId, deckId) => {
                return { payload: { gameId, deckId } };
            },
            () => {}
        ),
        sendStartGameMessage: () => {},
        sendLeaveGameMessage: () => {},
        sendChatMessage: () => {},
        sendClearUserSessions: () => {},
        sendGetNodeStausMessage: () => {},
        sendToggleNodeMessage: () => {},
        sendRestartNodeMessage: () => {},
        sendMotdMessage: () => {},
        sendJoinGameMessage: create.preparedReducer(
            (gameId, password = undefined) => {
                return { payload: { gameId, password } };
            },
            () => {}
        ),
        sendWatchGameMessage: () => {},
        sendRemoveGameMessage: () => {},
        sendAuthenticateMessage: () => {},
        sendLobbyChatMessage: () => {}
    })
});

export const {
    startConnecting,
    lobbyConnected,
    lobbyDisconnected,
    lobbyReconnecting,
    lobbyConnectionFailed,
    receiveGames,
    receiveNewGame,
    receiveRemoveGame,
    receiveUpdateGame,
    receiveUsers,
    receiveNewUser,
    receiveUserLeft,
    receivePasswordError,
    receiveLobbyChat,
    receiveLobbyMessages,
    receiveNoChat,
    receiveRemoveMessage,
    receiveBanner,
    receiveMotd,
    receiveClearGameState,
    receiveGameState,
    receiveGameError,
    receiveHandoff,
    receiveResponseTime,
    joinPasswordGame,
    cancelPasswordJoin,
    startNewGame,
    gameSocketClosed,
    cancelNewGame,
    clearChatStatus,
    sendNewGameMessage,
    sendSelectDeckMessage,
    sendStartGameMessage,
    sendLeaveGameMessage,
    sendChatMessage,
    sendClearUserSessions,
    sendGetNodeStausMessage,
    sendToggleNodeMessage,
    sendRestartNodeMessage,
    sendMotdMessage,
    sendJoinGameMessage,
    sendWatchGameMessage,
    sendRemoveGameMessage,
    sendAuthenticateMessage,
    sendLobbyChatMessage
} = lobbySlice.actions;

export default lobbySlice.reducer;
