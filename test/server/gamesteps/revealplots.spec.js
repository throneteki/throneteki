import RevealPlots from '../../../server/game/gamesteps/revealplots.js';

describe('RevealPlots', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'addMessage',
            'getPlayers',
            'raiseEvent',
            'queueStep'
        ]);
        this.phase = new RevealPlots(this.gameSpy, []);
    });

    describe('getInitiativeResult()', function () {
        beforeEach(function () {
            this.player1Spy = jasmine.createSpyObj('player', ['getInitiative', 'getTotalPower']);
            this.player2Spy = jasmine.createSpyObj('player', ['getInitiative', 'getTotalPower']);
            this.gameSpy.getPlayers.and.returnValue([this.player1Spy, this.player2Spy]);
        });

        describe('when one player has higher initiative', function () {
            beforeEach(function () {
                this.player1Spy.getInitiative.and.returnValue(4);
                this.player1Spy.getTotalPower.and.returnValue(3);

                this.player2Spy.getInitiative.and.returnValue(5);
                this.player2Spy.getTotalPower.and.returnValue(5);

                this.phase.determineInitiative();
            });

            it('should set the winner to that player', function () {
                expect(this.phase.initiativeResult).toEqual(
                    jasmine.objectContaining({
                        initiativeTied: false,
                        powerTied: false,
                        player: this.player2Spy
                    })
                );
            });
        });

        describe('when initiative is tied but one player has lower power', function () {
            beforeEach(function () {
                this.player1Spy.getInitiative.and.returnValue(5);
                this.player1Spy.getTotalPower.and.returnValue(3);

                this.player2Spy.getInitiative.and.returnValue(5);
                this.player2Spy.getTotalPower.and.returnValue(5);

                this.phase.determineInitiative();
            });

            it('should set the winner to that player', function () {
                expect(this.phase.initiativeResult).toEqual(
                    jasmine.objectContaining({
                        initiativeTied: true,
                        powerTied: false,
                        player: this.player1Spy
                    })
                );
            });
        });

        describe('when initiative is tied and a player can choose the winner', function () {
            beforeEach(function () {
                this.player1Spy.getInitiative.and.returnValue(5);
                this.player1Spy.getTotalPower.and.returnValue(3);
                this.player1Spy.choosesWinnerForInitiativeTies = true;

                this.player2Spy.getInitiative.and.returnValue(5);
                this.player2Spy.getTotalPower.and.returnValue(5);

                this.phase.determineInitiative();
            });

            it('should prompt the player to choose the winner', function () {
                expect(this.gameSpy.queueStep).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        player: this.player1Spy,
                        activePromptTitle: 'Choose player to win initiative'
                    })
                );
            });
        });

        describe('when initiative and power are tied', function () {
            beforeEach(function () {
                this.player1Spy.getInitiative.and.returnValue(5);
                this.player1Spy.getTotalPower.and.returnValue(3);

                this.player2Spy.getInitiative.and.returnValue(5);
                this.player2Spy.getTotalPower.and.returnValue(3);

                // Set up sampling function to just return the last entry.
                this.sampleFunc = jasmine.createSpy('sample');
                this.sampleFunc.and.callFake((array) => array[array.length - 1]);
                this.phase.sampleFunc = this.sampleFunc;

                this.phase.determineInitiative();
            });

            it('should set the winner at random', function () {
                expect(this.sampleFunc).toHaveBeenCalled();
                expect(this.phase.initiativeResult).toEqual(
                    jasmine.objectContaining({
                        initiativeTied: true,
                        powerTied: true,
                        player: this.player2Spy
                    })
                );
            });
        });
    });
});
