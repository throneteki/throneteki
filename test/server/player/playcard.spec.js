import Player from '../../../server/game/player.js';
import PlayActionPrompt from '../../../server/game/gamesteps/playactionprompt.js';

describe('Player', function () {
    beforeEach(function () {
        this.gameSpy = {
            addMessage: vi.fn(),
            resolveAbility: vi.fn(),
            queueStep: vi.fn(),
            raiseEvent: vi.fn()
        };
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.player.initialise();
    });

    describe('playCard', function () {
        beforeEach(function () {
            this.playActionSpy = {
                meetsRequirements: vi.fn(),
                canPayCosts: vi.fn(),
                canResolveTargets: vi.fn()
            };
            this.cardSpy = { getPlayActions: vi.fn() };

            this.player.hand.push(this.cardSpy);
            this.cardSpy.location = 'hand';
            this.cardSpy.controller = this.player;
        });

        describe('when card is undefined', function () {
            beforeEach(function () {
                this.player.hand.pop();
                this.canPlay = this.player.playCard(undefined);
            });

            it('should return false', function () {
                expect(this.canPlay, false).toBe(false);
            });

            it('should not put the card in play', function () {
                expect(this.player.cardsInPlay).not.toContain(this.cardSpy);
            });
        });

        describe('when card has play actions', function () {
            beforeEach(function () {
                this.cardSpy.getPlayActions.mockReturnValue([this.playActionSpy]);
            });

            describe('when the requirements are met and the costs can be paid', function () {
                beforeEach(function () {
                    this.playActionSpy.meetsRequirements.mockReturnValue(true);
                    this.playActionSpy.canPayCosts.mockReturnValue(true);
                    this.playActionSpy.canResolveTargets.mockReturnValue(true);
                });

                it('should resolve the play action', function () {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(
                        this.playActionSpy,
                        expect.objectContaining({
                            game: this.gameSpy,
                            player: this.player,
                            source: this.cardSpy
                        })
                    );
                });

                it('should return true', function () {
                    expect(this.player.playCard(this.cardSpy)).toBe(true);
                });
            });

            describe('when the requirements are met but the costs cannot be paid', function () {
                beforeEach(function () {
                    this.playActionSpy.meetsRequirements.mockReturnValue(true);
                    this.playActionSpy.canPayCosts.mockReturnValue(false);
                    this.playActionSpy.canResolveTargets.mockReturnValue(true);
                });

                it('should not resolve the play action', function () {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function () {
                    expect(this.player.playCard(this.cardSpy)).toBe(false);
                });
            });

            describe('when the costs can be paid but the requirements are not met', function () {
                beforeEach(function () {
                    this.playActionSpy.meetsRequirements.mockReturnValue(false);
                    this.playActionSpy.canPayCosts.mockReturnValue(true);
                    this.playActionSpy.canResolveTargets.mockReturnValue(true);
                });

                it('should not resolve the play action', function () {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function () {
                    expect(this.player.playCard(this.cardSpy)).toBe(false);
                });
            });

            describe('when targets cannot be resolved', function () {
                beforeEach(function () {
                    this.playActionSpy.meetsRequirements.mockReturnValue(true);
                    this.playActionSpy.canPayCosts.mockReturnValue(true);
                    this.playActionSpy.canResolveTargets.mockReturnValue(false);
                });

                it('should not resolve the play action', function () {
                    this.player.playCard(this.cardSpy);
                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });

                it('should return false', function () {
                    expect(this.player.playCard(this.cardSpy)).toBe(false);
                });
            });
        });

        describe('when card has multiple matching play actions', function () {
            beforeEach(function () {
                this.playActionSpy.meetsRequirements.mockReturnValue(true);
                this.playActionSpy.canPayCosts.mockReturnValue(true);
                this.playActionSpy.canResolveTargets.mockReturnValue(true);
                this.playActionSpy2 = {
                    meetsRequirements: vi.fn(),
                    canPayCosts: vi.fn(),
                    canResolveTargets: vi.fn()
                };
                this.playActionSpy2.meetsRequirements.mockReturnValue(true);
                this.playActionSpy2.canPayCosts.mockReturnValue(true);
                this.playActionSpy2.canResolveTargets.mockReturnValue(true);
                this.cardSpy.getPlayActions.mockReturnValue([
                    this.playActionSpy,
                    this.playActionSpy2
                ]);
            });

            it('should prompt the player to choose a play action', function () {
                this.player.playCard(this.cardSpy);
                expect(this.gameSpy.queueStep).toHaveBeenCalledWith(expect.any(PlayActionPrompt));
            });

            it('should return true', function () {
                expect(this.player.playCard(this.cardSpy)).toBe(true);
            });
        });
    });
});
