/*global describe, it, beforeEach, expect, spyOn, jasmine*/
/* eslint camelcase: 0, no-invalid-this: 0 */

const Game = require('../../../server/game/game.js');
const Player = require('../../../server/game/player.js');
const Spectator = require('../../../server/game/spectator.js');

describe('the Game', function() {
    beforeEach(function() {
        this.gameRepository = jasmine.createSpyObj('gameRepository', ['save']);
        this.game = new Game('1', 'Test Game', { gameRepository: this.gameRepository });

        this.player1 = new Player('1', { username: 'Player 1', settings: {} }, true, this.game);
        this.spectator = new Spectator('3', { username: 'Spectator 1', settings: {} }, this.game);

        this.game.playersAndSpectators[this.player1.id] = this.player1;
        this.game.playersAndSpectators[this.spectator.id] = this.spectator;

        this.game.initialise();

        this.chatCommands = this.game.chatCommands;
    });

    describe('the chat() function', function() {
        describe('when called by a player not in the game', function() {
            it('should not add any chat messages', function() {
                this.game.chat('notinthegame', 'Test Message');

                expect(this.game.messages.length).toBe(0);
            });
        });

        describe('when called by a player in the game', function() {
            describe('with no slashes', function() {
                it('should add their chat message', function() {
                    this.game.chat(this.player1.name, 'Test Message');

                    expect(this.game.messages.length).toBe(1);
                    expect(this.game.messages[0].message[1].name).toBe(this.player1.name);
                    expect(this.game.messages[0].message.join('')).toContain('Test Message');
                });
            });
        });

        describe('when called by a spectator in the game', function() {
            describe('with no slashes', function () {
                it('should add their chat message', function() {
                    this.game.chat(this.spectator.name, 'Test Message');

                    expect(this.game.messages.length).toBe(1);
                    expect(this.game.messages[0].message[1].name).toBe(this.spectator.name);
                    expect(this.game.messages[0].message.join('')).toContain('Test Message');
                });
            });

            describe('with a /power command', function() {
                it('should add the message to the messages', function() {
                    this.game.chat(this.spectator.name, '/power');

                    expect(this.game.messages.length).toBe(1);
                    expect(this.player1.setPower).toBe(undefined);
                });
            });
        });
    });
});
