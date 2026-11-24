import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentRestrictedList: {}
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: (create) => ({
        startGameConnecting: create.preparedReducer(
            (url, name) => ({ payload: { url, name } }),
            (state, action) => {
                state.connecting = true;
                state.host = action.payload.url;
                state.lost = undefined;
            }
        ),
        gameConnected: (state) => {
            state.connected = true;
            state.connecting = false;
            state.lost = undefined;
        },
        gameDisconnected: (state) => {
            state.connecting = false;
            state.connected = false;
            state.lost = undefined;
        },
        // The game socket dropped while a game was shown, rather than being closed by the client
        gameConnectionLost: create.preparedReducer(
            (reason, at = Date.now()) => ({ payload: { reason, at } }),
            (state, action) => {
                state.connecting = false;
                state.connected = false;
                state.lost = { ...action.payload, attempts: 0, trying: false };
            }
        ),
        gameReconnecting: (state) => {
            state.connecting = true;
            state.connected = false;
            if (state.lost) {
                state.lost.attempts += 1;
                state.lost.trying = true;
                state.lost.retryAt = undefined;
            }
        },
        gameRetryScheduled: (state, action) => {
            if (state.lost) {
                state.lost.retryAt = action.payload;
            }
        },
        gameConnectionFailed: (state, action) => {
            state.connecting = false;
            state.connected = false;
            if (state.lost) {
                state.lost.trying = false;
                state.lost.error = typeof action.payload === 'string' ? action.payload : undefined;
            }
        },
        reconnectGameNow: () => {},
        receiveResponseTime: (state, action) => {
            state.responseTime = action.payload;
        },
        sendToggleKeywordSettingMessage: create.preparedReducer(
            (option, value) => ({ payload: { option, value } }),
            () => {}
        ),
        sendToggleDupesMessage: () => {},
        sendTogglePromptedActionWindowMessage: create.preparedReducer(
            (option, value) => ({ payload: { option, value } }),
            () => {}
        ),
        sendToggleHideResponsesMessage: create.preparedReducer(
            (option, value) => ({ payload: { option, value } }),
            () => {}
        ),
        sendCardClickedMessage: () => {},
        sendButtonClickedMessage: create.preparedReducer(
            (promptId, command, method, arg) => ({ payload: { promptId, command, method, arg } }),
            () => {}
        ),
        sendShowDrawDeckMessage: () => {},
        sendShuffleDeckMessage: () => {},
        sendDragDropMessage: create.preparedReducer(
            (uuid, source, target, parentUuid) => ({
                payload: { uuid, source, target, parentUuid }
            }),
            () => {}
        ),
        sendGameChatMessage: () => {},
        sendToggleMuteSpectatorsMessage: () => {},
        sendToggleManualModeMessage: () => {},
        sendReportProblemMessage: () => {},
        sendDescribeProblemMessage: create.preparedReducer(
            (description) => ({ payload: { description } }),
            () => {}
        ),
        sendCancelProblemReportMessage: () => {},
        sendChangeStatMessage: create.preparedReducer(
            (type, amount) => ({ payload: { type, amount } }),
            () => {}
        ),
        sendLeaveGameMessage: () => {},
        sendConcedeMessage: () => {}
    })
});

export const {
    startGameConnecting,
    gameConnected,
    gameDisconnected,
    gameConnectionLost,
    gameReconnecting,
    gameConnectionFailed,
    gameRetryScheduled,
    reconnectGameNow,
    receiveResponseTime,
    sendToggleKeywordSettingMessage,
    sendToggleDupesMessage,
    sendTogglePromptedActionWindowMessage,
    sendToggleHideResponsesMessage,
    sendCardClickedMessage,
    sendButtonClickedMessage,
    sendShowDrawDeckMessage,
    sendShuffleDeckMessage,
    sendDragDropMessage,
    sendGameChatMessage,
    sendToggleMuteSpectatorsMessage,
    sendToggleManualModeMessage,
    sendReportProblemMessage,
    sendDescribeProblemMessage,
    sendCancelProblemReportMessage,
    sendChangeStatMessage,
    sendLeaveGameMessage,
    sendConcedeMessage
} = gameSlice.actions;

// Leaving a game we are still playing concedes it, so the player is asked first
export const mustConfirmLeave = (game, user) =>
    !!user &&
    Object.values({ ...game.players, ...game.spectators }).some(
        (player) => player.name === user.username && !player.canSafelyLeave
    );

export default gameSlice.reducer;
