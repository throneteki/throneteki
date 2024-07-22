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
        sendToggleTimerSetting: create.preparedReducer(
            (option, value) => ({ payload: { option, value } }),
            () => {}
        ),
        sendCardClickedMessage: () => {},
        sendButtonClickedMessage: create.preparedReducer(
            (promptId, command, method, arg) => ({ payload: { promptId, command, method, arg } }),
            () => {}
        ),
        sendCardMenuItemClickedMessage: create.preparedReducer(
            (cardId, menuItem) => ({ payload: { cardId, menuItem } }),
            () => {}
        ),
        sendShowDrawDeckMessage: () => {},
        sendShuffleDeckMessage: () => {},
        sendDragDropMessage: create.preparedReducer(
            (uuid, source, target) => ({ payload: { uuid, source, target } }),
            () => {}
        ),
        sendGameChatMessage: () => {},
        sendToggleMuteSpectatorsMessage: () => {},
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
    sendToggleTimerSetting,
    sendCardClickedMessage,
    sendButtonClickedMessage,
    sendCardMenuItemClickedMessage,
    sendShowDrawDeckMessage,
    sendShuffleDeckMessage,
    sendDragDropMessage,
    sendGameChatMessage,
    sendToggleMuteSpectatorsMessage,
    sendChangeStatMessage,
    sendLeaveGameMessage,
    sendConcedeMessage
} = gameSlice.actions;

export default gameSlice.reducer;
