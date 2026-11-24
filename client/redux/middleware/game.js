import { io } from 'socket.io-client';
import { createNextState } from '@reduxjs/toolkit';

import {
    gameConnected,
    gameConnectionFailed,
    gameConnectionLost,
    gameDisconnected,
    gameReconnecting,
    gameRetryScheduled,
    reconnectGameNow,
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
    startGameConnecting
} from '../reducers/game';
import { receiveClearGameState, receiveGameState } from '../reducers/lobby';
import { patchGameState } from '../../../shared/gameStateDiff';
import { serverWait } from '../../Components/GameBoard/serverWait';
import {
    applyPredictions,
    predictionFor,
    predictions,
    pressFor
} from '../../Components/GameBoard/predictions';

const GameEvent = Object.freeze({
    Connected: 'connect',
    Disconnected: 'disconnect',
    ConnectError: 'connect_error',
    ReconnectAttempt: 'reconnect_attempt',
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

// Development only: localStorage.simulatedLag = <ms> delays the game socket by that round trip
const simulatedLag = () => {
    if (!import.meta.env.DEV) {
        return 0;
    }

    try {
        return Math.max(0, Number(localStorage.getItem('simulatedLag')) || 0);
    } catch {
        return 0;
    }
};

const gameMiddleware = (store) => {
    let socket;
    let gameState;
    let resyncing = false;
    let lag = 0;

    const later = (callback) => (lag > 0 ? setTimeout(callback, lag / 2) : callback());
    const delayed =
        (handler) =>
        (...args) =>
            later(() => handler(...args));

    // The card clicked last, while its click is unanswered: a second click on it would land on the board the
    // first one leaves behind
    let lastClick;
    // What the message being sent is predicted to do, shown before it goes so no answer can come first
    let prediction;

    const emitGame = (...args) => {
        const seq = serverWait.sent();
        if ([prediction].flat().some(Boolean) && gameState) {
            predictions.add(seq, prediction);
            publish();
        }
        prediction = undefined;
        later(() => socket.emit('game', ...args));
        return seq;
    };

    const username = () => store.getState().auth.user?.username;

    const publish = () => {
        store.dispatch(
            receiveGameState(
                applyPredictions(gameState, predictions.list(), username()),
                username()
            )
        );
    };

    const promptId = () => gameState?.players?.[username()]?.promptId;

    const resetPredictions = () => {
        serverWait.reset();
        predictions.reset();
        lastClick = undefined;
    };

    const requestResync = () => {
        gameState = undefined;
        if (!resyncing) {
            resyncing = true;
            later(() => socket.emit(GameMessage.Resync));
        }
    };

    const receiveState = (state) => {
        gameState = state;
        serverWait.handled(state?.handledMessages);
        predictions.handled(
            Number.isInteger(state?.handledMessages) ? serverWait.handledCount() : Infinity
        );
        publish();
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
            lag = simulatedLag();
            resetPredictions();

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

            // socket.io picks each retry's delay from its backoff without saying what it is, so it is caught here
            // to count down to the next try
            const backoff = socket.io.backoff;
            const delayOf = backoff.duration.bind(backoff);
            backoff.duration = () => {
                const delay = delayOf();
                dispatch(gameRetryScheduled(Date.now() + delay));
                return delay;
            };

            socket.on(GameEvent.Connected, () => {
                dispatch(gameConnected());
            });

            socket.on(GameEvent.Disconnected, (reason) => {
                gameState = undefined;
                resyncing = false;
                resetPredictions();
                dispatch(
                    reason === 'io client disconnect' || !store.getState().lobby.currentGame
                        ? gameDisconnected()
                        : gameConnectionLost(reason)
                );
            });

            socket.on(GameEvent.ConnectError, (error) => {
                dispatch(gameConnectionFailed(error?.message));
            });

            socket.io.on(GameEvent.ReconnectAttempt, () => {
                dispatch(gameReconnecting());
            });

            socket.io.on(GameEvent.Error, (error) => {
                dispatch(gameConnectionFailed(error?.message));
            });

            socket.on(
                GameMessage.ClearGameState,
                delayed(() => {
                    gameState = undefined;
                    dispatch(receiveClearGameState());
                })
            );

            socket.on(
                GameMessage.GameState,
                delayed((state) => {
                    resyncing = false;
                    receiveState(state);
                })
            );

            socket.on(
                GameMessage.GameStateDiff,
                delayed((delta) => {
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
                })
            );

            setInterval(() => {
                const start = Date.now();

                later(() =>
                    socket.volatile.emit(
                        GameMessage.Ping,
                        delayed(() => {
                            const latency = Date.now() - start;
                            dispatch(receiveResponseTime(latency));
                        })
                    )
                );
            }, 5000);
        }

        // Disconnecting first drops any retry the socket has waiting, so this one goes now and the backoff
        // starts again from it if it fails
        if (reconnectGameNow.match(action)) {
            next(action);
            if (socket && !socket.connected) {
                socket.disconnect();
                dispatch(gameReconnecting());
                socket.connect();
            }
            return;
        }

        if (!isConnectionEstablished || !socket) {
            next(action);

            return;
        }

        // Judged on the board as shown, with what is already predicted on it
        prediction = predictionFor(
            action,
            store.getState().lobby.currentGame,
            store.getState().auth.user
        );

        if (sendToggleKeywordSettingMessage.match(action)) {
            emitGame(GameMessage.ToggleKeywordSetting, action.payload.option, action.payload.value);
        } else if (sendToggleDupesMessage.match(action)) {
            emitGame(GameMessage.ToggleDupes, action.payload);
        } else if (sendTogglePromptedActionWindowMessage.match(action)) {
            emitGame(
                GameMessage.TogglePromptedActionWindow,
                action.payload.option,
                action.payload.value
            );
        } else if (sendToggleHideResponsesMessage.match(action)) {
            emitGame(GameMessage.ToggleHideResponses, action.payload.option, action.payload.value);
        } else if (sendCardClickedMessage.match(action)) {
            if (
                prediction?.kind !== 'select' &&
                lastClick?.uuid === action.payload &&
                lastClick.seq > serverWait.handledCount()
            ) {
                return;
            }
            prediction = [
                prediction,
                pressFor(action, store.getState().lobby.currentGame, store.getState().auth.user)
            ];
            const seq = emitGame(GameMessage.CardClicked, action.payload, promptId());
            lastClick = { uuid: action.payload, seq };
        } else if (sendButtonClickedMessage.match(action)) {
            emitGame(
                action.payload.command,
                action.payload.arg,
                action.payload.method,
                action.payload.promptId
            );
        } else if (sendShowDrawDeckMessage.match(action)) {
            emitGame(GameMessage.ShowDrawDeck, action.payload);
        } else if (sendShuffleDeckMessage.match(action)) {
            emitGame(GameMessage.ShuffleDeck, action.payload);
        } else if (sendDragDropMessage.match(action)) {
            emitGame(
                GameMessage.DragDrop,
                action.payload.uuid,
                action.payload.source,
                action.payload.target,
                action.payload.parentUuid,
                promptId()
            );
        } else if (sendGameChatMessage.match(action)) {
            emitGame(GameMessage.Chat, action.payload);
        } else if (sendToggleMuteSpectatorsMessage.match(action)) {
            emitGame(GameMessage.ToggleMuteSpectators);
        } else if (sendToggleManualModeMessage.match(action)) {
            emitGame(GameMessage.ToggleManualMode);
        } else if (sendReportProblemMessage.match(action)) {
            emitGame(GameMessage.ReportProblem);
        } else if (sendDescribeProblemMessage.match(action)) {
            emitGame(GameMessage.DescribeProblem, action.payload.description);
        } else if (sendCancelProblemReportMessage.match(action)) {
            emitGame(GameMessage.CancelProblemReport);
        } else if (sendChangeStatMessage.match(action)) {
            emitGame(GameMessage.ChangeStat, action.payload.type, action.payload.amount);
        } else if (sendLeaveGameMessage.match(action)) {
            emitGame(GameMessage.LeaveGame);

            dispatch(gameDisconnected());
        } else if (sendConcedeMessage.match(action)) {
            emitGame(GameMessage.Concede);
        }

        prediction = undefined;

        next(action);
    };
};

export default gameMiddleware;
