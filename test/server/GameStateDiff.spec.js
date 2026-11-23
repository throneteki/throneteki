import { createNextState } from '@reduxjs/toolkit';

import GameServer from '../../server/gamenode/gameserver.js';
import { diffGameState, patchGameState, snapshotGameState } from '../../shared/gameStateDiff.js';

describe('game state diffs', function () {
    beforeEach(function () {
        this.setupTest({
            player1: { hand: ['Winterfell Steward'], inPlay: ['Eddard Stark (Core)'] },
            player2: { hand: ['Winterfell Steward'], inPlay: ['Eddard Stark (Core)'] }
        });

        this.server = {
            sentStates: new WeakMap(),
            handledMessages: new WeakMap(),
            findGameForUser: () => this.game,
            sendGameState: GameServer.prototype.sendGameState
        };
        this.clients = {};

        this.connect = (wrapper) => {
            const client = { messages: [], state: undefined };
            const name = wrapper.player.name;

            wrapper.player.socket = {
                send: (message, payload) => {
                    client.messages.push(message);
                    if (message === 'gamestate') {
                        client.state = payload;
                    } else if (message === 'gamestatediff') {
                        client.state = createNextState(client.state, (draft) => {
                            patchGameState(draft, payload);
                        });
                    }
                }
            };
            this.clients[name] = client;

            return client;
        };

        this.sendState = () => GameServer.prototype.sendGameState.call(this.server, this.game);

        this.expectClientsInSync = () => {
            for (const wrapper of [this.player1, this.player2]) {
                const name = wrapper.player.name;
                expect(this.clients[name].state).toEqual(
                    snapshotGameState({
                        ...this.game.getState(name),
                        handledMessages: 0,
                        messages: this.game.gameChat.getMessagesForClient()
                    })
                );
            }
        };

        this.connect(this.player1);
        this.connect(this.player2);
        this.sendState();
    });

    it('sends the whole state first', function () {
        expect(this.clients[this.player1.player.name].messages).toEqual(['gamestate']);
        expect(this.clients[this.player2.player.name].messages).toEqual(['gamestate']);
        this.expectClientsInSync();
    });

    it('keeps each client in step as the game is played', function () {
        const steps = [
            () => this.player1.clickCard('Winterfell Steward', 'hand'),
            () => this.player1.sendChat('hello'),
            () => this.player1.clickPrompt('Done'),
            () => this.player2.clickCard('Winterfell Steward', 'hand'),
            () => this.player2.clickPrompt('Done'),
            () => this.player1.clickPrompt('Military'),
            () => this.player1.clickCard('Eddard Stark', 'play area'),
            () => this.player1.clickPrompt('Done')
        ];

        for (const step of steps) {
            step();
            this.sendState();
            this.expectClientsInSync();
        }

        const messages = this.clients[this.player1.player.name].messages;
        expect(messages[0]).toBe('gamestate');
        expect(messages.slice(1)).toEqual(steps.map(() => 'gamestatediff'));
    });

    it('sends only what changed', function () {
        const client = this.clients[this.player1.player.name];
        const sizes = [];
        const send = this.player1.player.socket.send;
        this.player1.player.socket.send = (message, payload) => {
            sizes.push(JSON.stringify(payload).length);
            send(message, payload);
        };

        this.player1.sendChat('hello');
        this.sendState();

        expect(sizes[0]).toBeLessThan(JSON.stringify(client.state).length / 10);
    });

    it('sends only the new messages in the log', function () {
        const deltas = [];
        const send = this.player1.player.socket.send;
        this.player1.player.socket.send = (message, payload) => {
            deltas.push(payload);
            send(message, payload);
        };
        const start = this.game.gameChat.messages.length;

        this.player1.sendChat('hello');
        this.sendState();

        expect(deltas).toHaveLength(1);
        expect(Object.keys(deltas[0].messages).sort()).toEqual([String(start), '_t'].sort());
        expect(deltas[0].messages[start][0]).not.toHaveProperty('structuredMessage');
        this.expectClientsInSync();
    });

    it('sends the whole state again when the log is replaced', function () {
        this.game.gameChat.messages = this.game.gameChat.messages.slice(0, 2);
        this.sendState();

        expect(this.clients[this.player1.player.name].messages).toEqual(['gamestate', 'gamestate']);
        this.expectClientsInSync();
    });

    it('diffs an array that gains a null next to an object', function () {
        const previous = { items: [{ uuid: 'a', value: 1 }] };
        const next = { items: [null, { uuid: 'a', value: 2 }] };

        const patched = patchGameState(snapshotGameState(previous), diffGameState(previous, next));

        expect(patched).toEqual(next);
    });

    it('sends the whole state to a client that asks to resync', function () {
        GameServer.prototype.onResync.call(this.server, {
            user: { username: this.player1.player.name }
        });

        expect(this.clients[this.player1.player.name].messages).toEqual(['gamestate', 'gamestate']);
        expect(this.clients[this.player2.player.name].messages).toEqual(['gamestate']);
        this.expectClientsInSync();
    });

    it('forgets the state sent to a player who no longer has a socket', function () {
        this.player1.player.socket = undefined;
        this.sendState();

        const sentStates = this.server.sentStates.get(this.game);
        expect(sentStates.has(this.player1.player.name)).toBe(false);
        expect(sentStates.has(this.player2.player.name)).toBe(true);
    });

    it('keeps the parts of the client state that did not change', function () {
        const client = this.clients[this.player1.player.name];
        const before = client.state;

        this.player1.sendChat('hello');
        this.sendState();

        expect(client.state).not.toBe(before);
        expect(client.state.messages[0]).toBe(before.messages[0]);
        expect(client.state.players[this.player2.player.name]).toBe(
            before.players[this.player2.player.name]
        );
    });

    it('sends nothing when nothing changed', function () {
        this.sendState();

        expect(this.clients[this.player1.player.name].messages).toEqual(['gamestate']);
    });

    it('sends the whole state again to a new socket', function () {
        this.player1.sendChat('hello');
        const client = this.connect(this.player1);
        this.sendState();

        expect(client.messages).toEqual(['gamestate']);
        expect(this.clients[this.player2.player.name].messages).toEqual([
            'gamestate',
            'gamestatediff'
        ]);
        this.expectClientsInSync();
    });
});
