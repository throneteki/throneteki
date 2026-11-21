import { io } from 'socket.io-client';
import { createNextState } from '@reduxjs/toolkit';

import {
    gameConnected,
    gameConnectionFailed,
    gameDisconnected,
    gameReconnecting,
    receiveResponseTime,
    sendButtonClickedMessage,
    sendCardClickedMessage,
    sendChangeStatMessage,
    sendConcedeMessage,
    sendDragDropMessage,
    sendGameChatMessage,
    sendLeaveGameMessage,
    sendShowDrawDeckMessage,
    sendShuffleDeckMessage,
    sendToggleDupesMessage,
    sendToggleKeywordSettingMessage,
    sendToggleMuteSpectatorsMessage,
    sendToggleManualModeMessage,
    sendReportProblemMessage,
    sendDescribeProblemMessage,
    sendCancelProblemReportMessage,
    sendTogglePromptedActionWindowMessage,
    sendToggleHideResponsesMessage,
    sendCardSizeChangeMessage,
    startGameConnecting
} from '../reducers/game';
import { receiveClearGameState, receiveGameState } from '../reducers/lobby';
import { patchGameState } from '../../../shared/gameStateDiff';

const GameEvent = Object.freeze({
    Connected: 'connect',
    Disconnected: 'disconnect',
    Reconnecting: 'reconnect',
    Error: 'error'
});

const GameMessage = Object.freeze({
    GameState: 'gamestate',
    GameStateDiff: 'gamestatediff',
    Resync: 'resync',
    ToggleKeywordSetting: 'toggleKeywordSetting',
    ToggleDupes: 'toggleDupes',
    TogglePromptedActionWindow: 'togglePromptedActionWindow',
    ToggleHideResponses: 'toggleHideResponses',
    CardSizeChange: 'cardSizeChange',
    CardClicked: 'cardClicked',
    ShowDrawDeck: 'showDrawDeck',
    ShuffleDeck: 'shuffleDeck',
    DragDrop: 'drop',
    Chat: 'chat',
    ToggleMuteSpectators: 'toggleMuteSpectators',
    ToggleManualMode: 'toggleManualMode',
    ReportProblem: 'reportProblem',
    DescribeProblem: 'describeProblem',
    CancelProblemReport: 'cancelProblemReport',
    ChangeStat: 'changeStat',
    LeaveGame: 'leavegame',
    Concede: 'concede',
    ClearGameState: 'cleargamestate',
    Ping: 'ping'
});

const gameMiddleware = (store) => {
    let socket;
    let gameState;
    let resyncing = false;

    const requestResync = () => {
        gameState = undefined;
        if (!resyncing) {
            resyncing = true;
            socket.emit(GameMessage.Resync);
        }
    };

    const receiveState = (state) => {
        gameState = state;
        store.dispatch(
            receiveGameState(
                state,
                store.getState().auth.user ? store.getState().auth.user.username : undefined
            )
        );
    };

    return (next) => (action) => {
        const isConnectionEstablished = socket && store.getState().game.connected;
        const dispatch = store.dispatch;

        if (startGameConnecting.match(action)) {
            if (socket) {
                socket.disconnect();
                socket = null;
            }

            gameState = undefined;
            resyncing = false;

            socket = io(`${action.payload.url}`, {
                path: `/${action.payload.name}/socket.io`,
                reconnectionDelayMax: 10000,
                auth: {
                    token: store.getState().auth.token
                },
                query: {
                    version: import.meta.env.VITE_VERSION || 'Local build'
                }
            });

            socket.on(GameEvent.Connected, () => {
                dispatch(gameConnected());
            });

            socket.on(GameEvent.Disconnected, () => {
                gameState = undefined;
                resyncing = false;
                dispatch(gameDisconnected());
            });

            socket.on(GameEvent.Reconnecting, () => {
                dispatch(gameReconnecting());
            });

            socket.io.on(GameEvent.Error, () => {
                dispatch(gameConnectionFailed());
            });

            socket.on(GameMessage.ClearGameState, () => {
                gameState = undefined;
                dispatch(receiveClearGameState());
            });

            socket.on(GameMessage.GameState, (state) => {
                resyncing = false;
                receiveState(state);
            });

            socket.on(GameMessage.GameStateDiff, (delta) => {
                if (!gameState) {
                    requestResync();
                    return;
                }

                let patched;
                try {
                    patched = createNextState(gameState, (draft) => {
                        patchGameState(draft, delta);
                    });
                } catch {
                    requestResync();
                    return;
                }

                receiveState(patched);
            });

            setInterval(() => {
                const start = Date.now();

                socket.volatile.emit(GameMessage.Ping, () => {
                    const latency = Date.now() - start;
                    dispatch(receiveResponseTime(latency));
                });
            }, 5000);
        }

        if (!isConnectionEstablished || !socket) {
            next(action);

            return;
        }

        if (sendToggleKeywordSettingMessage.match(action)) {
            socket.emit(
                'game',
                GameMessage.ToggleKeywordSetting,
                action.payload.option,
                action.payload.value
            );
        } else if (sendToggleDupesMessage.match(action)) {
            socket.emit('game', GameMessage.ToggleDupes, action.payload);
        } else if (sendTogglePromptedActionWindowMessage.match(action)) {
            socket.emit(
                'game',
                GameMessage.TogglePromptedActionWindow,
                action.payload.option,
                action.payload.value
            );
        } else if (sendToggleHideResponsesMessage.match(action)) {
            socket.emit(
                'game',
                GameMessage.ToggleHideResponses,
                action.payload.option,
                action.payload.value
            );
        } else if (sendCardSizeChangeMessage.match(action)) {
            socket.emit('game', GameMessage.CardSizeChange, action.payload);
        } else if (sendCardClickedMessage.match(action)) {
            socket.emit('game', GameMessage.CardClicked, action.payload);
        } else if (sendButtonClickedMessage.match(action)) {
            socket.emit(
                'game',
                action.payload.command,
                action.payload.arg,
                action.payload.method,
                action.payload.promptId
            );
        } else if (sendShowDrawDeckMessage.match(action)) {
            socket.emit('game', GameMessage.ShowDrawDeck, action.payload.visible);
        } else if (sendShuffleDeckMessage.match(action)) {
            socket.emit('game', GameMessage.ShuffleDeck, action.payload);
        } else if (sendDragDropMessage.match(action)) {
            socket.emit(
                'game',
                GameMessage.DragDrop,
                action.payload.uuid,
                action.payload.source,
                action.payload.target
            );
        } else if (sendGameChatMessage.match(action)) {
            socket.emit('game', GameMessage.Chat, action.payload);
        } else if (sendToggleMuteSpectatorsMessage.match(action)) {
            socket.emit('game', GameMessage.ToggleMuteSpectators);
        } else if (sendToggleManualModeMessage.match(action)) {
            socket.emit('game', GameMessage.ToggleManualMode);
        } else if (sendReportProblemMessage.match(action)) {
            socket.emit('game', GameMessage.ReportProblem);
        } else if (sendDescribeProblemMessage.match(action)) {
            socket.emit('game', GameMessage.DescribeProblem, action.payload.description);
        } else if (sendCancelProblemReportMessage.match(action)) {
            socket.emit('game', GameMessage.CancelProblemReport);
        } else if (sendChangeStatMessage.match(action)) {
            socket.emit('game', GameMessage.ChangeStat, action.payload.type, action.payload.amount);
        } else if (sendLeaveGameMessage.match(action)) {
            socket.emit('game', GameMessage.LeaveGame);

            dispatch(gameDisconnected());
        } else if (sendConcedeMessage.match(action)) {
            socket.emit('game', GameMessage.Concede);
        }

        next(action);
    };
};

export default gameMiddleware;
