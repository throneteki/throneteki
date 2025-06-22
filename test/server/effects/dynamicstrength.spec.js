import Effects from '../../../server/game/effects.js';

describe('Effects.dynamicStrength', function () {
    beforeEach(function () {
        this.context = {};

        this.calculateMethod = jasmine.createSpy('calculateMethod');

        this.card1 = jasmine.createSpyObj('card1', [
            'addStrengthModifier',
            'changeStrengthModifier',
            'removeStrengthModifier'
        ]);
        this.card1.uuid = '1111';
        this.card2 = jasmine.createSpyObj('card2', [
            'addStrengthModifier',
            'changeStrengthModifier',
            'removeStrengthModifier'
        ]);
        this.card2.uuid = '2222';

        this.effect = Effects.dynamicStrength(this.calculateMethod);

        this.context.game = jasmine.createSpyObj('game', ['applyGameAction']);
        this.context.game.applyGameAction.and.callFake((action, card, callback) => callback(card));
        this.context.effect = this.effect;
    });

    describe('apply()', function () {
        beforeEach(function () {
            this.calculateMethod.and.returnValue(3);
            this.effect.apply(this.card1, this.context);
            this.calculateMethod.and.returnValue(4);
            this.effect.apply(this.card2, this.context);
        });

        it('should modify strength based on the result of the calculate method', function () {
            expect(this.card1.addStrengthModifier).toHaveBeenCalledWith(
                this.context.effect,
                3,
                true
            );
            expect(this.card2.addStrengthModifier).toHaveBeenCalledWith(
                this.context.effect,
                4,
                true
            );
        });

        it('should store the modifier for each card on context', function () {
            expect(Object.keys(this.context.dynamicStrength).length).toBe(2);
        });
    });

    describe('reapply()', function () {
        beforeEach(function () {
            this.calculateMethod.and.returnValue(3);
            this.effect.apply(this.card1, this.context);
            this.calculateMethod.and.returnValue(4);
            this.effect.reapply(this.card1, this.context);
        });

        it('should update the modifier stored on the card associated with the effect to the new value', function () {
            expect(this.card1.changeStrengthModifier).toHaveBeenCalledWith(
                this.context.effect,
                4,
                true
            );
        });
    });

    describe('unapply()', function () {
        beforeEach(function () {
            this.calculateMethod.and.returnValue(3);
            this.effect.apply(this.card1, this.context);
            this.calculateMethod.and.returnValue(4);
            this.effect.apply(this.card2, this.context);
        });

        it('should remove the modifier associated with the effect from the card', function () {
            this.effect.unapply(this.card1, this.context);
            this.effect.unapply(this.card2, this.context);
            expect(this.card1.removeStrengthModifier).toHaveBeenCalledWith(this.effect, false);
            expect(this.card2.removeStrengthModifier).toHaveBeenCalledWith(this.effect, false);
        });
    });
});
