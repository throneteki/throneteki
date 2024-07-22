import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    socket: undefined,
    connecting: false,
    connected: false,
    gameHost: undefined,
    gameId: undefined
};

const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        gameSocketConnected(state, action) {
            state.socket = action.payload.socket;
            state.connecting = false;
            state.connected = true;
        },
        gameSocketConnecting(state, action) {
            state.connecting = true;
            state.connected = false;
            state.gameHost = action.payload.host;
        },
        gameSocketConnectFailed(state) {
            state.connecting = false;
            state.connected = false;
            state.gameHost = undefined;
        },
        gameSocketDisconnected(state) {
            state.connecting = false;
            state.connected = false;
        },
        gameSocketReconnecting(state) {
            state.connecting = true;
            state.connected = false;
        },
        gameSocketReconnected(state) {
            state.connecting = false;
            state.connected = true;
        },
        gameSocketClosed(state) {
            state.connected = false;
            state.connecting = false;
            state.gameHost = undefined;
            state.socket = undefined;
        },
        handoffReceived(state, action) {
            state.gameId = action.payload.details.gameId;
        }
    }
});

export const {
    gameSocketConnected,
    gameSocketConnecting,
    gameSocketConnectFailed,
    gameSocketDisconnected,
    gameSocketReconnecting,
    gameSocketReconnected,
    gameSocketClosed,
    handoffReceived
} = gamesSlice.actions;

export default gamesSlice.reducer;
