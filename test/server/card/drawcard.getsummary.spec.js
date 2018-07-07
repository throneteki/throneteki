const DrawCard = require('../../../server/game/drawcard.js');

describe('DrawCard', function () {
    function createPlayerSpy(name) {
        let player = jasmine.createSpyObj('player', ['getCardSelectionState']);
        player.name = name;
        return player;
    }

    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1', faction: 'neutral' };
        this.card = new DrawCard({}, this.testCard);
        this.activePlayer = createPlayerSpy('player1');
        this.card.owner = this.activePlayer;
    });

    describe('getSummary', function() {
        describe('strength property', function() {
            describe('when the card has non-zero strength', function() {
                beforeEach(function() {
                    this.testCard.strength = 5;
                    this.summary = this.card.getSummary(this.activePlayer, false);
                });

                it('should include the strength', function() {
                    expect(this.summary.strength).toBe(5);
                });
            });

            describe('when the card has a zero strength', function() {
                beforeEach(function() {
                    this.testCard.strength = 0;
                    this.summary = this.card.getSummary(this.activePlayer, false);
                });

                it('should include the strength', function() {
                    expect(this.summary.strength).toBe(0);
                });
            });
        });

        describe('when a card is facedown', function() {
            beforeEach(function() {
                this.testCard.strength = 5;
                let anotherPlayer = createPlayerSpy('player2');
                this.summary = this.card.getSummary(anotherPlayer, true);
            });

            it('should not include baseStrength', function() {
                expect(this.summary.baseStrength).toBeUndefined();
            });

            it('should not include iconsAdded', function() {
                expect(this.summary.iconsAdded).toBeUndefined();
            });

            it('should not include iconsRemoved', function() {
                expect(this.summary.iconsRemoved).toBeUndefined();
            });

            it('should not include strength', function() {
                expect(this.summary.strength).toBeUndefined();
            });
        });
    });
});
