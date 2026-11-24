import { configureStore } from '@reduxjs/toolkit';
import GameServer from '../../server/gamenode/gameserver.js';
import auth, { setUser } from '../../client/redux/reducers/auth.js';
import lobby from '../../client/redux/reducers/lobby.js';
import game, {
    reconnectGameNow,
    sendCardClickedMessage,
    startGameConnecting
} from '../../client/redux/reducers/game.js';
import gameMiddleware from '../../client/redux/middleware/game.js';
import { predictions } from '../../client/Components/GameBoard/predictions.js';

// The client's socket, wired straight to a game server in the same process
const network = {
    handlers: {},
    managerHandlers: {},
    calls: [],
    retryDelay: 0,
    toServer: () => {},
    delay: 0
};
const deliver = (callback) =>
    network.delay > 0 ? setTimeout(callback, network.delay) : callback();

vi.mock('socket.io-client', () => ({
    io: () =>
        (network.socket = {
            on: (event, callback) => {
                network.handlers[event] = callback;
            },
            io: {
                on: (event, callback) => {
                    network.managerHandlers[event] = callback;
                },
                backoff: { duration: () => network.retryDelay }
            },
            connected: false,
            volatile: { emit() {} },
            emit: (event, ...args) => deliver(() => network.toServer(event, ...args)),
            disconnect() {
                network.calls.push('disconnect');
            },
            connect() {
                network.calls.push('connect');
            }
        })
}));

// The first player's client, with its store and socket middleware, joined to the game the test set up
const joinAsPlayer1 = (context) => {
    const server = Object.assign(Object.create(GameServer.prototype), {
        games: { [context.game.id]: context.game },
        sentStates: new WeakMap(),
        handledMessages: new WeakMap(),
        pendingProblemReports: new WeakMap()
    });
    const name = context.player1Object.name;
    const socket = {
        user: { username: name },
        send: (message, payload) => deliver(() => network.handlers[message]?.(payload))
    };
    context.player1Object.socket = socket;
    context.player2Object.socket = { user: { username: context.player2Object.name }, send() {} };
    context.sent = [];
    network.toServer = (event, ...args) => {
        if (event === 'game') {
            context.sent.push(args);
            server.onGameMessage(socket, ...args);
        }
    };

    context.store = configureStore({
        reducer: { auth, lobby, game },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).concat(
                gameMiddleware
            )
    });
    context.store.dispatch(setUser({ username: name }));
    context.store.dispatch(startGameConnecting('http://localhost', 'node'));
    network.handlers.connect();

    context.connect = (delay) => {
        network.delay = delay;
        server.sendGameState(context.game);
        vi.advanceTimersByTime(delay);
    };
    context.shown = () => context.store.getState().lobby.currentGame.players[name];
    context.shownCard = (card) =>
        Object.values(context.shown().cardPiles)
            .flat()
            .find((shown) => shown.uuid === card.uuid);
    context.click = (card) => context.store.dispatch(sendCardClickedMessage(card.uuid));
};

describe('the client predicting a choice against the game server', function () {
    beforeEach(function () {
        vi.useFakeTimers();
    });

    afterEach(function () {
        vi.useRealTimers();
    });

    describe('when choosing characters for military claim', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Tyrion Lannister (Core)', 'Winterfell Steward', 'Bran Stark (Core)']
                },
                player2: { plot: 'Sneak Attack', inPlay: ['Hedge Knight'] }
            });
            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
            joinAsPlayer1(this);
        });

        it('shows the card chosen before the server answers, then as the server has it', function () {
            this.connect(100);
            expect(this.shown().selectToggle).toEqual({ limit: 2 });

            this.click(this.tyrionLannister);
            expect(this.shownCard(this.tyrionLannister).selected).toBe(true);
            expect(this.player1Object.getSelectedCards()).toEqual([]);

            vi.advanceTimersByTime(100);
            expect(this.player1Object.getSelectedCards()).toEqual([this.tyrionLannister]);
            expect(this.shownCard(this.tyrionLannister).selected).toBe(true);

            vi.advanceTimersByTime(100);
            expect(predictions.list()).toEqual([]);
            expect(this.shownCard(this.tyrionLannister).selected).toBe(true);
            expect(this.shownCard(this.winterfellSteward).selected).toBe(false);
            expect(this.player1).toHavePrompt('Select 2 characters to fulfill military claim');
        });

        it('sends the click with the prompt it was made in', function () {
            this.connect(100);
            const promptId = this.shown().promptId;

            this.click(this.tyrionLannister);
            vi.advanceTimersByTime(100);

            expect(this.sent).toEqual([['cardClicked', this.tyrionLannister.uuid, promptId]]);
            expect(this.player1).toHavePrompt('Select 2 characters to fulfill military claim');
        });

        it('shows the card clicked as pressed until the server has answered the click', function () {
            this.connect(100);

            this.click(this.tyrionLannister);
            expect(this.shownCard(this.tyrionLannister).pressed).toBe(true);
            expect(this.shownCard(this.winterfellSteward).pressed).toBeUndefined();

            vi.advanceTimersByTime(200);
            expect(this.shownCard(this.tyrionLannister).pressed).toBeUndefined();
            expect(this.shownCard(this.tyrionLannister).selected).toBe(true);
            expect(this.player1).toHavePrompt('Select 2 characters to fulfill military claim');
        });

        it('shows a card that cannot be chosen as pressed too, until the server has answered', function () {
            this.connect(100);
            const theirs = () =>
                Object.values(this.store.getState().lobby.currentGame.players)
                    .flatMap((player) => Object.values(player.cardPiles).flat())
                    .find((shown) => shown.uuid === this.hedgeKnight.uuid);

            this.click(this.hedgeKnight);
            expect(theirs().pressed).toBe(true);
            expect(theirs().selected).toBeFalsy();

            vi.advanceTimersByTime(200);
            expect(theirs().pressed).toBeUndefined();
            expect(this.player1).toHavePrompt('Select 2 characters to fulfill military claim');
        });

        it('leaves nothing predicted when the answer comes at once', function () {
            this.connect(0);

            this.click(this.tyrionLannister);

            expect(predictions.list()).toEqual([]);
            expect(this.shownCard(this.tyrionLannister).selected).toBe(true);
            expect(this.player1).toHavePrompt('Select 2 characters to fulfill military claim');
        });
    });

    describe('when choosing a plot', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['A Noble Cause', 'Sneak Attack'] }
            });
            joinAsPlayer1(this);
            this.noble = this.player1.findCardByName('A Noble Cause', 'plot deck');
            this.sneak = this.player1.findCardByName('Sneak Attack', 'plot deck');
        });

        it('shows the plot clicked as the only one chosen before the server answers', function () {
            this.connect(100);
            expect(this.shown().selectToggle).toEqual({ replace: true });

            this.click(this.noble);
            expect(this.shownCard(this.noble).selected).toBe(true);
            vi.advanceTimersByTime(200);

            this.click(this.sneak);
            expect(this.shownCard(this.sneak).selected).toBe(true);
            expect(this.shownCard(this.noble).selected).toBe(false);
            expect(this.noble.selected).toBe(true);

            vi.advanceTimersByTime(200);
            expect(predictions.list()).toEqual([]);
            expect(this.shownCard(this.sneak).selected).toBe(true);
            expect(this.shownCard(this.noble).selected).toBe(false);
            expect(this.player1).toHavePrompt('Select a plot');
        });
    });

    describe('when discarding down to reserve', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { hand: Array(7).fill('Hedge Knight') }
            });
            this.completeChallengesPhase();
            joinAsPlayer1(this);
            this.card = this.player1Object.hand[0];
        });

        it('shows the card chosen before the server answers', function () {
            this.connect(100);
            expect(this.shown().selectToggle).toEqual({ limit: 1 });

            this.click(this.card);
            expect(this.shownCard(this.card).selected).toBe(true);

            vi.advanceTimersByTime(200);
            expect(predictions.list()).toEqual([]);
            expect(this.shownCard(this.card).selected).toBe(true);
            expect(this.player1).toHavePrompt(
                'Select 1 cards to discard down to reserve (top first)'
            );
        });
    });

    describe('when discarding more than one card down to reserve', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { hand: Array(8).fill('Hedge Knight') }
            });
            this.completeChallengesPhase();
            joinAsPlayer1(this);
            [this.first, this.second, this.third] = this.player1Object.hand;
            this.orders = () =>
                [this.first, this.second, this.third].map((card) => this.shownCard(card).order);
        });

        it('numbers the cards in the order chosen before the server answers', function () {
            this.connect(100);

            this.click(this.second);
            this.click(this.first);
            expect(this.orders()).toEqual([2, 1, undefined]);

            vi.advanceTimersByTime(300);
            expect(predictions.list()).toEqual([]);
            expect(this.orders()).toEqual([2, 1, undefined]);

            this.click(this.second);
            expect(this.orders()).toEqual([1, undefined, undefined]);

            vi.advanceTimersByTime(300);
            expect(this.orders()).toEqual([1, undefined, undefined]);
            expect(this.player1).toHavePrompt(
                'Select 2 cards to discard down to reserve (top first)'
            );
        });
    });
});

describe('the client losing its connection to the game server', function () {
    beforeEach(function () {
        vi.useFakeTimers();
        this.setupTest({ phase: 'marshal' });
        joinAsPlayer1(this);
        this.connect(0);
        network.calls = [];
        this.lost = () => this.store.getState().game.lost;
    });

    afterEach(function () {
        vi.useRealTimers();
    });

    it('says the connection was lost when it drops during a game', function () {
        network.handlers.disconnect('transport close');

        expect(this.lost()).toEqual({
            reason: 'transport close',
            at: expect.any(Number),
            attempts: 0,
            trying: false
        });
        expect(this.store.getState().game.connected).toBe(false);
    });

    it('follows each attempt to reconnect, and clears once connected again', function () {
        network.handlers.disconnect('ping timeout');

        network.managerHandlers.reconnect_attempt(1);
        expect(this.lost()).toMatchObject({ attempts: 1, trying: true });

        network.managerHandlers.error(new Error('xhr poll error'));
        expect(this.lost()).toMatchObject({ attempts: 1, trying: false, error: 'xhr poll error' });

        network.managerHandlers.reconnect_attempt(2);
        expect(this.lost()).toMatchObject({ attempts: 2, trying: true });

        network.handlers.connect();
        expect(this.lost()).toBeUndefined();
        expect(this.store.getState().game.connected).toBe(true);
    });

    it('counts down to the retry the socket schedules after each failure', function () {
        vi.setSystemTime(new Date('2026-11-24T12:00:00Z'));
        network.handlers.disconnect('transport close');

        network.retryDelay = 1200;
        network.socket.io.backoff.duration();
        expect(this.lost().retryAt).toBe(Date.now() + 1200);

        network.managerHandlers.reconnect_attempt(1);
        expect(this.lost().retryAt).toBeUndefined();

        network.managerHandlers.error(new Error('xhr poll error'));
        network.retryDelay = 2600;
        expect(network.socket.io.backoff.duration()).toBe(2600);
        expect(this.lost()).toMatchObject({
            attempts: 1,
            trying: false,
            retryAt: Date.now() + 2600
        });
    });

    it('does not say the connection was lost when the client closed it', function () {
        network.handlers.disconnect('io client disconnect');

        expect(this.lost()).toBeUndefined();
    });

    it('tries again at once when asked to, dropping the retry it had waiting', function () {
        network.handlers.disconnect('io server disconnect');

        this.store.dispatch(reconnectGameNow());

        expect(network.calls).toEqual(['disconnect', 'connect']);
        expect(this.lost()).toMatchObject({
            reason: 'io server disconnect',
            attempts: 1,
            trying: true
        });
    });
});
