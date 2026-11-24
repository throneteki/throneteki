import { createNextState } from '@reduxjs/toolkit';

import {
    sendButtonClickedMessage,
    sendCardClickedMessage,
    sendGameChatMessage,
    sendShowDrawDeckMessage,
    sendToggleDupesMessage,
    sendToggleHideResponsesMessage,
    sendToggleKeywordSettingMessage,
    sendTogglePromptedActionWindowMessage
} from '../../redux/reducers/game';

// What the board shows for messages the server has not answered yet. Only what the client already knows the
// outcome of is predicted, and each prediction is dropped as soon as the server has handled its message, so a
// wrong guess lasts one round trip at most.
let pending = [];

export const predictions = {
    add(seq, prediction) {
        const added = [prediction].flat().filter(Boolean);
        if (added.length > 0) {
            pending = [...pending, ...added.map((one) => ({ ...one, seq }))];
        }
    },
    handled(count) {
        pending = pending.filter((prediction) => prediction.seq > count);
    },
    reset() {
        pending = [];
    },
    list: () => pending
};

const cardPaths = (state, matches, root = ['players']) => {
    const found = [];
    const visit = (value, path) => {
        if (!value || typeof value !== 'object') {
            return;
        }
        if (value.uuid && matches(value)) {
            found.push(path);
        }
        for (const [key, child] of Object.entries(value)) {
            if (key !== 'messages' && child && typeof child === 'object') {
                visit(child, [...path, key]);
            }
        }
    };
    visit(at(state, root), root);
    return found;
};

const at = (root, path) => path.reduce((value, key) => value?.[key], root);

const withUuid = (uuid) => (card) => card.uuid === uuid;

const findCard = (state, uuid) => {
    const [path] = cardPaths(state, withUuid(uuid));
    return path ? at(state, path) : undefined;
};

// A click toggles the card only in a prompt that says so, and adds none past its limit. Choosing a plot
// (replace) makes the card clicked the only one chosen.
const selectionPrediction = (state, me, uuid) => {
    const toggle = me?.selectToggle;
    const card = toggle && findCard(state, uuid);
    if (toggle?.replace) {
        return card?.selectable ? { kind: 'select', uuid, replace: true } : undefined;
    }
    if (!card || !(card.selectable || card.selected)) {
        return;
    }
    if (
        !card.selected &&
        toggle.limit !== undefined &&
        cardPaths(state, (card) => card.selected).length >= toggle.limit
    ) {
        return;
    }
    return { kind: 'select', uuid };
};

// A card clicked shows as pressed until the server has handled the click, whatever the click turns out to do
export const pressFor = (action, state, user) => {
    const me = user?.username && state?.players?.[user.username];
    return me && sendCardClickedMessage.match(action) && findCard(state, action.payload)
        ? { kind: 'press', uuid: action.payload }
        : undefined;
};

const settingPath = (action) => {
    if (sendToggleKeywordSettingMessage.match(action)) {
        return ['keywordSettings', action.payload.option];
    }
    if (sendTogglePromptedActionWindowMessage.match(action)) {
        return ['promptedActionWindows', action.payload.option];
    }
    if (sendToggleHideResponsesMessage.match(action)) {
        return { interrupts: ['hideInterrupts'], reactions: ['hideReactions'] }[
            action.payload.option
        ];
    }
    if (sendToggleDupesMessage.match(action)) {
        return ['promptDupes'];
    }
};

export const predictionFor = (action, state, user) => {
    const username = user?.username;
    const me = username && state?.players?.[username];

    if (sendCardClickedMessage.match(action)) {
        return selectionPrediction(state, me, action.payload);
    }

    if (sendButtonClickedMessage.match(action)) {
        const { promptId, command, method, arg } = action.payload;
        return me ? { kind: 'button', promptId, command, method, arg } : undefined;
    }

    if (sendGameChatMessage.match(action)) {
        const text = action.payload;
        if (
            !username ||
            typeof text !== 'string' ||
            !text.trim() ||
            text.startsWith('/') ||
            (!me && state?.muteSpectators)
        ) {
            return;
        }
        return {
            kind: 'chat',
            date: new Date().toISOString(),
            message: [{ name: username, argType: 'player', role: user.role }, ' ', text]
        };
    }

    if (sendShowDrawDeckMessage.match(action)) {
        const visible = typeof action.payload === 'boolean' ? action.payload : !me?.showDeck;
        return me && !visible ? { kind: 'closeDeck' } : undefined;
    }

    const path = settingPath(action);
    if (me && path) {
        const value = sendToggleDupesMessage.match(action) ? action.payload : action.payload.value;
        return { kind: 'setting', path, value: !!value };
    }
};

// As the server numbers an ordered choice: a card chosen goes last, and taking one out moves those after it up
const renumber = (draft, card) => {
    const numbered = cardPaths(
        draft,
        (other) => other.uuid !== card.uuid && other.order !== undefined
    ).map((path) => at(draft, path));
    if (card.selected) {
        card.order = numbered.length + 1;
        return;
    }
    const removed = card.order;
    delete card.order;
    for (const other of numbered) {
        if (removed !== undefined && other.order > removed) {
            other.order -= 1;
        }
    }
};

const applyOne = (draft, prediction, username, base, settled) => {
    const me = username ? draft.players?.[username] : undefined;
    switch (prediction.kind) {
        case 'select':
            if (prediction.replace) {
                for (const path of cardPaths(base, (card) => card.selectable, [
                    'players',
                    username
                ])) {
                    const card = at(draft, path);
                    card.selected = card.uuid === prediction.uuid;
                }
                break;
            }
            for (const path of cardPaths(base, withUuid(prediction.uuid))) {
                const card = at(draft, path);
                card.selected = !card.selected;
                if (me?.selectOrder) {
                    renumber(draft, card);
                } else if (!card.selected) {
                    delete card.order;
                }
            }
            break;
        case 'press':
            if (!settled) {
                for (const path of cardPaths(base, withUuid(prediction.uuid))) {
                    at(draft, path).pressed = true;
                }
            }
            break;
        case 'button': {
            if (settled) {
                break;
            }
            const button = me?.buttons?.find(
                (button) =>
                    button.promptId === prediction.promptId &&
                    (button.command || 'menuButton') === (prediction.command || 'menuButton') &&
                    button.method === prediction.method &&
                    button.arg === prediction.arg
            );
            if (button) {
                button.pending = true;
            }
            break;
        }
        case 'chat':
            draft.messages?.push({
                date: prediction.date,
                message: prediction.message,
                ...(settled ? {} : { pending: true })
            });
            break;
        case 'closeDeck':
            if (me) {
                me.showDeck = false;
            }
            break;
        case 'setting': {
            const [key, option] = prediction.path;
            if (!me || !(key in me)) {
                break;
            }
            if (option === undefined) {
                me[key] = prediction.value;
            } else if (me[key] && option in me[key]) {
                me[key][option] = prediction.value;
            }
            break;
        }
    }
};

// settled: as the server would leave it, for the dev board's pretend server
export const applyPredictions = (state, list, username, settled = false) => {
    if (!state || list.length === 0) {
        return state;
    }

    return createNextState(state, (draft) => {
        for (const prediction of list) {
            applyOne(draft, prediction, username, state, settled);
        }
    });
};
