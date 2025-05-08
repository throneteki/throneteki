import DrawCard from '../../../server/game/drawcard.js';

describe('DrawCard', function () {
    function createPlayerSpy(name) {
        let player = jasmine.createSpyObj('player', ['getCardSelectionState', 'isSpectator']);
        player.name = name;
        return player;
    }

    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['isCardVisible']);
        this.gameSpy.isCardVisible.and.returnValue(true);
        this.testCard = {
            code: '111',
            label: 'test 1(some pack)',
            name: 'test 1',
            faction: 'neutral'
        };
        this.card = new DrawCard({}, this.testCard);
        this.card.game = this.gameSpy;
        this.activePlayer = createPlayerSpy('player1');
        this.card.owner = this.activePlayer;
    });

    describe('getSummary', function () {
        describe('strength property', function () {
            describe('when the card has non-zero strength', function () {
                beforeEach(function () {
                    this.testCard.strength = 5;
                    this.card = new DrawCard({}, this.testCard);
                    this.card.game = this.gameSpy;
                    this.card.owner = this.activePlayer;
                    this.summary = this.card.getSummary(this.activePlayer, false);
                });

                it('should include the strength', function () {
                    expect(this.summary.strength).toBe(5);
                });
            });

            describe('when the card has a zero strength', function () {
                beforeEach(function () {
                    this.testCard.strength = 0;
                    this.card = new DrawCard({}, this.testCard);
                    this.card.game = this.gameSpy;
                    this.card.owner = this.activePlayer;
                    this.summary = this.card.getSummary(this.activePlayer, false);
                });

                it('should include the strength', function () {
                    expect(this.summary.strength).toBe(0);
                });
            });
        });

        describe('when a card is not visible', function () {
            beforeEach(function () {
                this.testCard.strength = 5;
                let anotherPlayer = createPlayerSpy('player2');
                this.gameSpy.isCardVisible.and.returnValue(false);
                this.summary = this.card.getSummary(anotherPlayer);
            });

            it('should not include baseStrength', function () {
                expect(this.summary.baseStrength).toBeUndefined();
            });

            it('should not include iconsAdded', function () {
                expect(this.summary.iconsAdded).toBeUndefined();
            });

            it('should not include iconsRemoved', function () {
                expect(this.summary.iconsRemoved).toBeUndefined();
            });

            it('should not include strength', function () {
                expect(this.summary.strength).toBeUndefined();
            });
        });
    });
});
