import RevealPlots from '../../../server/game/gamesteps/revealplots.js';

describe('RevealPlots', function () {
    beforeEach(function () {
        this.gameSpy = {
            addMessage: vi.fn(),
            getPlayers: vi.fn(),
            raiseEvent: vi.fn(),
            queueStep: vi.fn(),
            chooseTieWinnerController: vi.fn((type, callback) => {
                const flag =
                    type === 'initiative'
                        ? 'choosesWinnerForInitiativeTies'
                        : 'choosesWinnerForDominanceTies';
                callback(this.gameSpy.getPlayers().find((player) => player[flag]));
            })
        };
        this.phase = new RevealPlots(this.gameSpy, []);
    });

    describe('getInitiativeResult()', function () {
        beforeEach(function () {
            this.player1Spy = { getInitiative: vi.fn(), getTotalPower: vi.fn() };
            this.player2Spy = { getInitiative: vi.fn(), getTotalPower: vi.fn() };
            this.gameSpy.getPlayers.mockReturnValue([this.player1Spy, this.player2Spy]);
        });

        describe('when one player has higher initiative', function () {
            beforeEach(function () {
                this.player1Spy.getInitiative.mockReturnValue(4);
                this.player1Spy.getTotalPower.mockReturnValue(3);

                this.player2Spy.getInitiative.mockReturnValue(5);
                this.player2Spy.getTotalPower.mockReturnValue(5);

                this.phase.determineInitiative();
            });

            it('should set the winner to that player', function () {
                expect(this.phase.initiativeResult).toEqual(
                    expect.objectContaining({
                        initiativeTied: false,
                        powerTied: false,
                        player: this.player2Spy
                    })
                );
            });
        });

        describe('when initiative is tied but one player has lower power', function () {
            beforeEach(function () {
                this.player1Spy.getInitiative.mockReturnValue(5);
                this.player1Spy.getTotalPower.mockReturnValue(3);

                this.player2Spy.getInitiative.mockReturnValue(5);
                this.player2Spy.getTotalPower.mockReturnValue(5);

                this.phase.determineInitiative();
            });

            it('should set the winner to that player', function () {
                expect(this.phase.initiativeResult).toEqual(
                    expect.objectContaining({
                        initiativeTied: true,
                        powerTied: false,
                        player: this.player1Spy
                    })
                );
            });
        });

        describe('when initiative is tied and a player can choose the winner', function () {
            beforeEach(function () {
                this.player1Spy.getInitiative.mockReturnValue(5);
                this.player1Spy.getTotalPower.mockReturnValue(3);
                this.player1Spy.choosesWinnerForInitiativeTies = true;

                this.player2Spy.getInitiative.mockReturnValue(5);
                this.player2Spy.getTotalPower.mockReturnValue(5);

                this.phase.determineInitiative();
            });

            it('should prompt the player to choose the winner', function () {
                expect(this.gameSpy.queueStep).toHaveBeenCalledWith(
                    expect.objectContaining({
                        player: this.player1Spy,
                        activePromptTitle: 'Choose player to win initiative'
                    })
                );
            });
        });

        describe('when initiative and power are tied', function () {
            beforeEach(function () {
                this.player1Spy.getInitiative.mockReturnValue(5);
                this.player1Spy.getTotalPower.mockReturnValue(3);

                this.player2Spy.getInitiative.mockReturnValue(5);
                this.player2Spy.getTotalPower.mockReturnValue(3);

                // Set up sampling function to just return the last entry.
                this.sampleFunc = vi.fn();
                this.sampleFunc.mockImplementation((array) => array[array.length - 1]);
                this.phase.sampleFunc = this.sampleFunc;

                this.phase.determineInitiative();
            });

            it('should set the winner at random', function () {
                expect(this.sampleFunc).toHaveBeenCalled();
                expect(this.phase.initiativeResult).toEqual(
                    expect.objectContaining({
                        initiativeTied: true,
                        powerTied: true,
                        player: this.player2Spy
                    })
                );
            });
        });
    });
});
