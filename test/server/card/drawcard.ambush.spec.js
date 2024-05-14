import DrawCard from '../../../server/game/drawcard.js';

describe('DrawCard', function () {
    describe('getAmbushCost()', function () {
        beforeEach(function () {
            this.card = new DrawCard({}, {});
        });

        describe('when the card does not have ambush', function () {
            it('should not have the ambush keyword', function () {
                expect(this.card.isAmbush()).toBe(false);
            });

            it('should have no ambush cost', function () {
                expect(this.card.getAmbushCost()).toBeUndefined();
            });
        });

        describe('when the card has ambush', function () {
            beforeEach(function () {
                this.card.addKeyword('Ambush (2)');
                this.card.addKeyword('Ambush (3)');
            });

            it('should have the ambush keyword', function () {
                expect(this.card.isAmbush()).toBe(true);
            });

            it('should return the lowest cost', function () {
                expect(this.card.getAmbushCost()).toBe(2);
            });
        });
    });
});
