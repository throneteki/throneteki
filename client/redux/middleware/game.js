import { io } from 'socket.io-client';

import {
    gameConnected,
    gameConnectionFailed,
    gameDisconnected,
    gameReconnecting,
    receiveResponseTime,
    sendButtonClickedMessage,
    sendCardClickedMessage,
    sendCardMenuItemClickedMessage,
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
    sendTogglePromptedActionWindowMessage,
    sendToggleTimerSetting,
    startGameConnecting
} from '../reducers/game';
import { receiveClearGameState, receiveGameState } from '../reducers/lobby';

const GameEvent = Object.freeze({
    Connected: 'connect',
    Disconnected: 'disconnect',
    Reconnecting: 'reconnect',
    Error: 'error'
});

const GameMessage = Object.freeze({
    GameState: 'gamestate',
    ToggleKeywordSetting: 'toggleKeywordSetting',
    ToggleDupes: 'toggleDupes',
    TogglePromptedActionWindow: 'togglePromptedActionWindow',
    ToggleTimerSetting: 'toggleTimerSetting',
    CardClicked: 'cardClicked',
    MenuItemClick: 'menuItemClick',
    ShowDrawDeck: 'showDrawDeck',
    ShuffleDeck: 'shuffleDeck',
    DragDrop: 'drop',
    Chat: 'chat',
    ToggleMuteSpectators: 'toggleMuteSpectators',
    ChangeStat: 'changeStat',
    LeaveGame: 'leavegame',
    Concede: 'concede',
    ClearGameState: 'cleargamestate',
    Ping: 'ping'
});

const gameMiddleware = (store) => {
    let socket;

    return (next) => (action) => {
        const isConnectionEstablished = socket && store.getState().game.connected;
        const dispatch = store.dispatch;

        if (startGameConnecting.match(action)) {
            if (socket) {
                socket.disconnect();
                socket = null;
            }

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
                dispatch(gameDisconnected());
            });

            socket.on(GameEvent.Reconnecting, () => {
                dispatch(gameReconnecting());
            });

            socket.io.on(GameEvent.Error, () => {
                dispatch(gameConnectionFailed());
            });

            socket.on(GameMessage.ClearGameState, () => {
                dispatch(receiveClearGameState());
            });

            socket.on(GameMessage.GameState, (game) => {
                dispatch(
                    receiveGameState(
                        game,
                        store.getState().auth.user ? store.getState().auth.user.username : undefined
                    )
                );
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
        } else if (sendToggleTimerSetting.match(action)) {
            socket.emit(
                'game',
                GameMessage.ToggleTimerSetting,
                action.payload.option,
                action.payload.value
            );
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
        } else if (sendCardMenuItemClickedMessage.match(action)) {
            socket.emit(
                'game',
                GameMessage.MenuItemClick,
                action.payload.cardId,
                action.payload.menuItem
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
