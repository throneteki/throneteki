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
            }
        ),
        gameConnected: (state) => {
            state.connected = true;
            state.connecting = false;
        },
        gameDisconnected: (state) => {
            state.connecting = false;
            state.connected = false;
        },
        gameReconnecting: (state) => {
            state.connecting = true;
            state.connected = false;
        },
        gameConnectionFailed: (state) => {
            state.connecting = false;
            state.connected = false;
        },
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
        // quiet: the server says the click does nothing, so the board does not wait for it
        sendCardClickedMessage: create.preparedReducer(
            (uuid, quiet = false) => ({ payload: uuid, meta: { quiet } }),
            () => {}
        ),
        sendButtonClickedMessage: create.preparedReducer(
            (promptId, command, method, arg) => ({ payload: { promptId, command, method, arg } }),
            () => {}
        ),
        sendShowDrawDeckMessage: () => {},
        sendHudChangeMessage: () => {},
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
    gameReconnecting,
    gameConnectionFailed,
    receiveResponseTime,
    sendToggleKeywordSettingMessage,
    sendToggleDupesMessage,
    sendTogglePromptedActionWindowMessage,
    sendToggleHideResponsesMessage,
    sendCardClickedMessage,
    sendButtonClickedMessage,
    sendShowDrawDeckMessage,
    sendHudChangeMessage,
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
