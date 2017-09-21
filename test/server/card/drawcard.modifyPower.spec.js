const DrawCard = require('../../../server/game/drawcard.js');

describe('DrawCard', function () {
    beforeEach(function () {
        this.testCard = { code: '111', label: 'test 1(some pack)', name: 'test 1' };
        this.gameSpy = jasmine.createSpyObj('game', ['raiseEvent', 'checkWinCondition', 'applyGameAction']);
        this.gameSpy.applyGameAction.and.callFake((action, card, callback) => callback(card));
        this.card = new DrawCard({ game: this.gameSpy }, this.testCard);
    });

    describe('modifyPower()', function() {
        describe('when called with a positive power', function() {
            it('should increase the power on the card and raise a onCardPowerGained event', function() {
                this.card.modifyPower(2);

                expect(this.card.power).toBe(2);
                expect(this.gameSpy.raiseEvent).toHaveBeenCalledWith('onCardPowerGained', { card: this.card, power: 2 });
            });
        });

        describe('when called with a negative power', function() {
            it('should reduce the power on the card and raise a onCardPowerGained event', function() {
                this.card.power = 2;
                this.card.modifyPower(-2);

                expect(this.card.power).toBe(0);
                expect(this.gameSpy.raiseEvent).not.toHaveBeenCalled();
            });
        });

        describe('when a card power would go negative', function() {
            it('should set the power of the card to 0', function() {
                this.card.power = 2;
                this.card.modifyPower(-5);

                expect(this.card.power).toBe(0);
                expect(this.gameSpy.raiseEvent).not.toHaveBeenCalled();
            });
        });
    });
});
