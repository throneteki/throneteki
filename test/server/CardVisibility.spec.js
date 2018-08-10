const CardVisibility = require ('../../server/game/CardVisibility');

describe('CardVisibility', function() {
    beforeEach(function() {
        this.spectator = { specator: true };
        this.controller = { controller: true };
        this.opponent = { opponent: true };
        this.card = { location: 'play area', facedown: false, controller: this.controller };
        this.gameSpy = jasmine.createSpyObj('game', ['isSpectator']);
        this.gameSpy.isSpectator.and.callFake(p => p === this.specator);

        this.visibility = new CardVisibility(this.gameSpy);
    });

    describe('isVisible()', function() {
        describe('when the card face up', function() {
            beforeEach(function() {
                this.card.facedown = false;
            });

            describe('and it is in a open information location', function() {
                beforeEach(function() {
                    this.card.location = 'discard pile';
                });

                it('should return true for the controller', function() {
                    expect(this.visibility.isVisible(this.card, this.controller)).toBe(true);
                });

                it('should return true for the opponent', function() {
                    expect(this.visibility.isVisible(this.card, this.opponent)).toBe(true);
                });

                it('should return true for spectators', function() {
                    expect(this.visibility.isVisible(this.card, this.specator)).toBe(true);
                });
            });

            describe('and it is in a hidden information location', function() {
                beforeEach(function() {
                    this.card.location = 'hand';
                });

                it('should return true for the controller', function() {
                    expect(this.visibility.isVisible(this.card, this.controller)).toBe(true);
                });

                it('should return false for the opponent', function() {
                    expect(this.visibility.isVisible(this.card, this.opponent)).toBe(false);
                });

                it('should return false for spectators', function() {
                    expect(this.visibility.isVisible(this.card, this.specator)).toBe(false);
                });

                describe('when showHand is on', function() {
                    beforeEach(function() {
                        this.gameSpy.showHand = true;
                    });

                    it('should still return false for the opponent', function() {
                        expect(this.visibility.isVisible(this.card, this.opponent)).toBe(false);
                    });

                    it('should return true for spectators', function() {
                        expect(this.visibility.isVisible(this.card, this.specator)).toBe(true);
                    });
                });
            });

            describe('and it is in the draw deck', function() {
                beforeEach(function() {
                    this.card.location = 'draw deck';
                });

                it('should return false for the controller', function() {
                    expect(this.visibility.isVisible(this.card, this.controller)).toBe(false);
                });

                it('should return true for the controller if showDeck is on', function() {
                    this.controller.showDeck = true;

                    expect(this.visibility.isVisible(this.card, this.controller)).toBe(true);
                });
            });
        });

        describe('when the card is face down', function() {
            beforeEach(function() {
                this.card.facedown = true;
                this.card.location = 'play area';
            });

            it('should return true for the controller', function() {
                expect(this.visibility.isVisible(this.card, this.controller)).toBe(true);
            });

            it('should return false for the opponent', function() {
                expect(this.visibility.isVisible(this.card, this.opponent)).toBe(false);
            });

            it('should return false for spectators', function() {
                expect(this.visibility.isVisible(this.card, this.specator)).toBe(false);
            });
        });
    });

    describe('addRule()', function() {
        it('should allow otherwise disallowed cards to be visible', function() {
            this.card.location = 'plot deck';
            this.visibility.addRule((card, player) => player === this.opponent);

            expect(this.visibility.isVisible(this.card, this.opponent)).toBe(true);
        });
    });
});
