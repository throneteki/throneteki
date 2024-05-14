import ActionWindow from '../../../server/game/gamesteps/actionwindow.js';
import Game from '../../../server/game/game.js';
import Player from '../../../server/game/player.js';
import Settings from '../../../server/settings.js';

describe('ActionWindow', function () {
    beforeEach(function () {
        this.gameService = jasmine.createSpyObj('gameService', ['save']);
        this.game = new Game({ owner: {} }, { gameService: this.gameService });
        this.player1 = new Player(
            '1',
            Settings.getUserWithDefaultsSet({ username: 'Player 1' }),
            true,
            this.game
        );
        this.player2 = new Player(
            '2',
            Settings.getUserWithDefaultsSet({ username: 'Player 2' }),
            false,
            this.game
        );
        this.player2.firstPlayer = true;
        this.game.playersAndSpectators[this.player1.name] = this.player1;
        this.game.playersAndSpectators[this.player2.name] = this.player2;

        this.player1.promptedActionWindows['test'] = true;

        this.prompt = new ActionWindow(this.game, 'Test Window', 'test');
    });

    it('should prompt in first player order', function () {
        expect(this.prompt.currentPlayer).toBe(this.player2);
    });

    describe('onMenuCommand()', function () {
        describe('when it is the current player', function () {
            beforeEach(function () {
                this.prompt.onMenuCommand(this.player2);
            });

            it('should make the next player be the current player', function () {
                expect(this.prompt.currentPlayer).toBe(this.player1);
            });
        });

        describe('when it is not the current player', function () {
            beforeEach(function () {
                this.prompt.onMenuCommand(this.player1);
            });

            it('should not change the current player', function () {
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });
        });
    });

    describe('markActionAsTaken()', function () {
        describe('when a player takes an action', function () {
            beforeEach(function () {
                // Complete the window for player 2
                this.prompt.onMenuCommand(this.player2);

                // Player 1 takes an action
                this.prompt.markActionAsTaken(this.player1);
            });

            it('should rotate the current player', function () {
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });

            it('should re-prompt other players once the current player is done', function () {
                this.prompt.onMenuCommand(this.player2);
                expect(this.prompt.currentPlayer).toBe(this.player1);
                expect(this.prompt.isComplete()).toBe(false);
            });

            it('should require two consecutive passes before completing', function () {
                // Complete without taking action
                this.prompt.onMenuCommand(this.player2);
                this.prompt.onMenuCommand(this.player1);

                expect(this.prompt.isComplete()).toBe(true);
            });
        });

        describe('when someone other than the current player takes an action', function () {
            beforeEach(function () {
                // Player 2 is first player, so player 1 takes their action out
                // of turn.
                this.prompt.markActionAsTaken(this.player1);
            });

            it('should rotate the current player', function () {
                // Since player 1 took their action out of turn, player 2 should
                // be prompted again for their action.
                expect(this.prompt.currentPlayer).toBe(this.player2);
            });
        });
    });

    describe('continue()', function () {
        describe('when not all players are done', function () {
            beforeEach(function () {
                this.prompt.onMenuCommand(this.player2);
            });

            it('should return false', function () {
                expect(this.prompt.continue()).toBe(false);
            });
        });

        describe('when all players are done', function () {
            beforeEach(function () {
                this.prompt.onMenuCommand(this.player2);
                this.prompt.onMenuCommand(this.player1);
            });

            it('should return true', function () {
                expect(this.prompt.continue()).toBe(true);
            });
        });

        describe('when only the second player has the window enabled', function () {
            beforeEach(function () {
                this.player1.promptedActionWindows['test'] = true;
                this.player2.promptedActionWindows['test'] = false;
            });

            it('should prompt the first player even though the window is off', function () {
                this.prompt.continue();

                expect(this.prompt.currentPlayer).toBe(this.player2);
            });

            it('should not complete the prompt', function () {
                expect(this.prompt.continue()).toBe(false);
            });
        });

        describe('when both players have the window disabled', function () {
            beforeEach(function () {
                this.player1.promptedActionWindows['test'] = false;
                this.player2.promptedActionWindows['test'] = false;
            });

            it('should complete the prompt', function () {
                expect(this.prompt.continue()).toBe(true);
            });
        });
    });
});
