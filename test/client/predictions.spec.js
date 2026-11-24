import {
    applyPredictions,
    predictionFor,
    predictions,
    pressFor
} from '../../client/Components/GameBoard/predictions.js';
import {
    sendButtonClickedMessage,
    sendCardClickedMessage,
    sendGameChatMessage,
    sendShowDrawDeckMessage,
    sendToggleDupesMessage,
    sendToggleHideResponsesMessage,
    sendToggleKeywordSettingMessage,
    sendTogglePromptedActionWindowMessage
} from '../../client/redux/reducers/game.js';

const user = { username: 'me', role: 'user' };
const spectator = { username: 'watcher' };

const gameState = () => ({
    muteSpectators: false,
    messages: [],
    players: {
        me: {
            promptId: 'p1',
            selectToggle: { limit: 2 },
            showDeck: true,
            promptDupes: false,
            hideInterrupts: true,
            keywordSettings: { chooseOrder: false },
            promptedActionWindows: { marshal: true },
            buttons: [
                { text: 'Done', command: 'menuButton', arg: 'done', promptId: 'p1' },
                { text: 'Cancel', command: 'menuButton', arg: 'cancel', promptId: 'p1' }
            ],
            cardPiles: {
                hand: [
                    { uuid: 'chosen', selectable: true, selected: false },
                    { uuid: 'ordered', selectable: true, selected: true, order: 1 },
                    { uuid: 'idle', selectable: false }
                ]
            }
        },
        them: { cardPiles: { hand: [{ uuid: 'theirs', selectable: true, selected: false }] } }
    }
});

const predicted = (state, ...actions) =>
    applyPredictions(
        state,
        actions.map((action, index) => ({ ...predictionFor(action, state, user), seq: index + 1 })),
        user.username
    );

const card = (state, uuid) =>
    Object.values(state.players)
        .flatMap((player) => player.cardPiles.hand)
        .find((card) => card.uuid === uuid);

const pressDone = (promptId = 'p1') =>
    sendButtonClickedMessage(promptId, 'menuButton', undefined, 'done');

describe('predictions', function () {
    beforeEach(function () {
        predictions.reset();
    });

    it('toggles the selection of a card that can be selected', function () {
        const state = gameState();
        const next = predicted(state, sendCardClickedMessage('chosen'));

        expect(card(next, 'chosen').selected).toBe(true);
        expect(card(state, 'chosen').selected).toBe(false);
        expect(card(next, 'idle')).toBe(card(state, 'idle'));
    });

    it('toggles back on a second click', function () {
        const next = predicted(
            gameState(),
            sendCardClickedMessage('chosen'),
            sendCardClickedMessage('chosen')
        );

        expect(card(next, 'chosen').selected).toBe(false);
    });

    it('drops the order of a card it deselects', function () {
        const next = predicted(gameState(), sendCardClickedMessage('ordered'));

        expect(card(next, 'ordered').selected).toBe(false);
        expect(card(next, 'ordered').order).toBeUndefined();
    });

    it('predicts nothing for a card that cannot be selected', function () {
        expect(predictionFor(sendCardClickedMessage('idle'), gameState(), user)).toBeUndefined();
        expect(predictionFor(sendCardClickedMessage('missing'), gameState(), user)).toBeUndefined();
    });

    it('predicts nothing when the prompt does not say a click toggles the card', function () {
        const state = gameState();
        delete state.players.me.selectToggle;

        expect(predictionFor(sendCardClickedMessage('chosen'), state, user)).toBeUndefined();
    });

    it('adds no card past the limit, but still takes one away', function () {
        const shown = predicted(gameState(), sendCardClickedMessage('chosen'));

        expect(predictionFor(sendCardClickedMessage('theirs'), shown, user)).toBeUndefined();
        expect(predictionFor(sendCardClickedMessage('ordered'), shown, user)).toEqual({
            kind: 'select',
            uuid: 'ordered'
        });
    });

    it('adds any number of cards with no limit', function () {
        const state = gameState();
        state.players.me.selectToggle = {};
        const shown = predicted(state, sendCardClickedMessage('chosen'));

        expect(predictionFor(sendCardClickedMessage('theirs'), shown, user)).toEqual({
            kind: 'select',
            uuid: 'theirs'
        });
    });

    it('numbers an ordered choice as the server does', function () {
        const state = gameState();
        state.players.me.selectOrder = true;
        state.players.me.selectToggle = {};
        const chosen = predicted(state, sendCardClickedMessage('chosen'));

        expect(card(chosen, 'ordered').order).toBe(1);
        expect(card(chosen, 'chosen').order).toBe(2);

        const withdrawn = applyPredictions(
            chosen,
            [{ kind: 'select', uuid: 'ordered', seq: 2 }],
            'me'
        );
        expect(card(withdrawn, 'ordered').order).toBeUndefined();
        expect(card(withdrawn, 'chosen').order).toBe(1);
    });

    it('makes the card clicked the only one of the player chosen when choosing replaces', function () {
        const state = gameState();
        state.players.me.selectToggle = { replace: true };
        const next = predicted(state, sendCardClickedMessage('chosen'));

        expect(card(next, 'chosen').selected).toBe(true);
        expect(card(next, 'ordered').selected).toBe(false);
        expect(card(next, 'theirs').selected).toBe(false);
        expect(predicted(next, sendCardClickedMessage('chosen')).players.me).toEqual(
            next.players.me
        );
        expect(predictionFor(sendCardClickedMessage('idle'), state, user)).toBeUndefined();
    });

    it('predicts nothing for someone not playing', function () {
        expect(
            predictionFor(sendCardClickedMessage('chosen'), gameState(), spectator)
        ).toBeUndefined();
        expect(predictionFor(pressDone(), gameState(), spectator)).toBeUndefined();
    });

    it('marks only the button pressed', function () {
        const next = predicted(gameState(), pressDone());

        expect(next.players.me.buttons.map((button) => !!button.pending)).toEqual([true, false]);
    });

    it('marks no button from a prompt that has closed', function () {
        const next = predicted(gameState(), pressDone('p0'));

        expect(next.players.me.buttons.some((button) => button.pending)).toBe(false);
    });

    it('shows a chat message before the server has it', function () {
        const next = predicted(gameState(), sendGameChatMessage('hello there'));

        expect(next.messages).toEqual([
            {
                date: expect.any(String),
                message: [{ name: 'me', argType: 'player', role: 'user' }, ' ', 'hello there'],
                pending: true
            }
        ]);
    });

    it('does not predict chat commands, empty messages or muted spectators', function () {
        const state = gameState();
        expect(predictionFor(sendGameChatMessage('/power 1'), state, user)).toBeUndefined();
        expect(predictionFor(sendGameChatMessage('  '), state, user)).toBeUndefined();

        state.muteSpectators = true;
        expect(predictionFor(sendGameChatMessage('hi'), state, spectator)).toBeUndefined();
        expect(predictionFor(sendGameChatMessage('hi'), state, user)).toBeDefined();
    });

    it('closes the draw deck but never opens it', function () {
        const state = gameState();
        expect(predicted(state, sendShowDrawDeckMessage(false)).players.me.showDeck).toBe(false);

        state.players.me.showDeck = false;
        expect(predictionFor(sendShowDrawDeckMessage(true), state, user)).toBeUndefined();
    });

    it('changes settings the player has', function () {
        const next = predicted(
            gameState(),
            sendToggleKeywordSettingMessage('chooseOrder', true),
            sendToggleDupesMessage(true),
            sendTogglePromptedActionWindowMessage('marshal', false),
            sendToggleHideResponsesMessage('interrupts', false)
        );

        expect(next.players.me.keywordSettings.chooseOrder).toBe(true);
        expect(next.players.me.promptDupes).toBe(true);
        expect(next.players.me.promptedActionWindows.marshal).toBe(false);
        expect(next.players.me.hideInterrupts).toBe(false);
    });

    it('adds no setting the player does not have', function () {
        const next = predicted(
            gameState(),
            sendToggleKeywordSettingMessage('unknown', true),
            sendTogglePromptedActionWindowMessage('unknown', true)
        );

        expect(next.players.me.keywordSettings).toEqual({ chooseOrder: false });
        expect(next.players.me.promptedActionWindows).toEqual({ marshal: true });
    });

    it('leaves the state alone with nothing predicted', function () {
        const state = gameState();
        expect(applyPredictions(state, [], 'me')).toBe(state);
    });

    it('settles as the server would, with nothing left pending', function () {
        const state = gameState();
        const prediction = predictionFor(sendGameChatMessage('hi'), state, user);
        const next = applyPredictions(
            state,
            [prediction, { kind: 'button', ...pressDone().payload }],
            'me',
            true
        );

        expect(next.messages[0].pending).toBeUndefined();
        expect(next.players.me.buttons.some((button) => button.pending)).toBe(false);
    });

    it('presses any card the player clicks, whatever the click does', function () {
        const state = gameState();
        const presses = ['chosen', 'idle', 'theirs'].map((uuid) =>
            pressFor(sendCardClickedMessage(uuid), state, user)
        );
        const next = applyPredictions(
            state,
            presses.map((press) => ({ ...press, seq: 1 })),
            'me'
        );

        expect(presses).toEqual([
            { kind: 'press', uuid: 'chosen' },
            { kind: 'press', uuid: 'idle' },
            { kind: 'press', uuid: 'theirs' }
        ]);
        expect(
            ['chosen', 'idle', 'theirs', 'ordered'].map((uuid) => !!card(next, uuid).pressed)
        ).toEqual([true, true, true, false]);
        expect(card(next, 'chosen').selected).toBe(false);
    });

    it('presses nothing for someone not playing, or a card not on the board', function () {
        expect(pressFor(sendCardClickedMessage('chosen'), gameState(), spectator)).toBeUndefined();
        expect(pressFor(sendCardClickedMessage('missing'), gameState(), user)).toBeUndefined();
        expect(pressFor(pressDone(), gameState(), user)).toBeUndefined();
    });

    it('leaves no card pressed once settled', function () {
        const next = applyPredictions(
            gameState(),
            [{ kind: 'press', uuid: 'chosen', seq: 1 }],
            'me',
            true
        );

        expect(card(next, 'chosen').pressed).toBeUndefined();
    });

    it('keeps every prediction made for one message, and drops them together', function () {
        predictions.add(1, [
            { kind: 'select', uuid: 'chosen' },
            undefined,
            { kind: 'press', uuid: 'chosen' }
        ]);

        expect(predictions.list()).toEqual([
            { kind: 'select', uuid: 'chosen', seq: 1 },
            { kind: 'press', uuid: 'chosen', seq: 1 }
        ]);

        predictions.handled(1);
        expect(predictions.list()).toEqual([]);
    });

    it('drops predictions once their message is handled', function () {
        predictions.add(1, { kind: 'closeDeck' });
        predictions.add(2, { kind: 'closeDeck' });
        predictions.add(3, undefined);

        predictions.handled(1);
        expect(predictions.list().map((prediction) => prediction.seq)).toEqual([2]);

        predictions.handled(2);
        expect(predictions.list()).toEqual([]);
    });
});
