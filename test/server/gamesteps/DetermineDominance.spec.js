import DetermineDominance from '../../../server/game/gamesteps/DetermineDominance.js';
import Game from '../../../server/game/game.js';
import Player from '../../../server/game/player.js';
import Settings from '../../../server/settings.js';

describe('DetermineDominance', function () {
    beforeEach(function () {
        let gameService = jasmine.createSpyObj('gameService', ['save']);
        this.game = new Game({ owner: {} }, { gameService: gameService });
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
        this.game.playersAndSpectators['Player 1'] = this.player1;
        this.game.playersAndSpectators['Player 2'] = this.player2;
        this.step = new DetermineDominance(this.game);
        spyOn(this.game, 'raiseEvent');
        spyOn(this.game, 'addMessage');
        spyOn(this.game, 'queueStep');
        spyOn(this.player1, 'getDominance');
        spyOn(this.player2, 'getDominance');
    });

    describe('continue()', function () {
        describe('when dominance strength is a tie', function () {
            beforeEach(function () {
                this.player1.getDominance.and.returnValue(5);
                this.player2.getDominance.and.returnValue(5);
            });

            it('should not determine a winner', function () {
                this.step.continue();
                expect(this.game.raiseEvent).toHaveBeenCalledWith(
                    'onDominanceDetermined',
                    jasmine.objectContaining({
                        winner: undefined,
                        difference: 0,
                        chosenBy: undefined
                    }),
                    jasmine.any(Function)
                );
            });

            describe('and a player can determine ties', function () {
                beforeEach(function () {
                    this.player1.choosesWinnerForDominanceTies = true;
                });

                it('should allow that player to choose the winner', function () {
                    this.step.continue();
                    expect(this.game.queueStep).toHaveBeenCalledWith(
                        jasmine.objectContaining({
                            player: this.player1,
                            activePromptTitle: 'Choose player to win dominance'
                        })
                    );
                });
            });
        });

        describe('when dominance strength is not tied', function () {
            beforeEach(function () {
                this.player1.getDominance.and.returnValue(3);
                this.player2.getDominance.and.returnValue(5);
            });

            it('should determine a winner', function () {
                this.step.continue();
                expect(this.game.raiseEvent).toHaveBeenCalledWith(
                    'onDominanceDetermined',
                    jasmine.objectContaining({
                        winner: this.player2,
                        difference: 2,
                        chosenBy: undefined
                    }),
                    jasmine.any(Function)
                );
            });
        });
    });
});
