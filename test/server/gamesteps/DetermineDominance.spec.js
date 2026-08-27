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
        beforeEach(function () {
            // Simulate the raised event resolving, and return the event it was populated onto.
            this.resolveEvent = () => {
                this.event = {};
                const call = this.game.raiseEvent.calls
                    .allArgs()
                    .find((args) => args[0] === 'onDominanceDetermined');
                call[2](this.event);
                return this.event;
            };
        });

        it('should raise onDominanceDetermined immediately, before calculating anything', function () {
            this.step.continue();
            expect(this.game.raiseEvent).toHaveBeenCalledWith(
                'onDominanceDetermined',
                {},
                jasmine.any(Function)
            );
        });

        describe('when dominance strength is a tie', function () {
            beforeEach(function () {
                this.player1.getDominance.and.returnValue(5);
                this.player2.getDominance.and.returnValue(5);
            });

            it('should not determine a winner', function () {
                this.step.continue();
                const event = this.resolveEvent();
                expect(event.winner).toBeUndefined();
                expect(event.difference).toBe(0);
                expect(event.chosenBy).toBeUndefined();
            });

            describe('and a player can determine ties', function () {
                beforeEach(function () {
                    this.player1.choosesWinnerForDominanceTies = true;
                });

                it('should allow that player to choose the winner', function () {
                    this.step.continue();
                    this.resolveEvent();
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
                const event = this.resolveEvent();
                expect(event.winner).toBe(this.player2);
                expect(event.difference).toBe(2);
                expect(event.chosenBy).toBeUndefined();
            });
        });
    });
});
