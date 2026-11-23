import { configureStore } from '@reduxjs/toolkit';
import GameServer from '../../server/gamenode/gameserver.js';
import auth, { setUser } from '../../client/redux/reducers/auth.js';
import lobby from '../../client/redux/reducers/lobby.js';
import game, {
    sendCardClickedMessage,
    startGameConnecting
} from '../../client/redux/reducers/game.js';
import gameMiddleware from '../../client/redux/middleware/game.js';
import { predictions } from '../../client/Components/GameBoard/predictions.js';

// The client's socket, wired straight to a game server in the same process
const network = { handlers: {}, toServer: () => {}, delay: 0 };
const deliver = (callback) =>
    network.delay > 0 ? setTimeout(callback, network.delay) : callback();

vi.mock('socket.io-client', () => ({
    io: () => ({
        on: (event, callback) => {
            network.handlers[event] = callback;
        },
        io: { on() {} },
        volatile: { emit() {} },
        emit: (event, ...args) => deliver(() => network.toServer(event, ...args)),
        disconnect() {}
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
