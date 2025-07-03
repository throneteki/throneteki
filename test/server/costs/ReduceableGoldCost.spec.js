import ReduceableGoldCost from '../../../server/game/costs/ReduceableGoldCost.js';

describe('ReduceableGoldCost', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['addMessage', 'spendGold']);
        this.playerSpy = jasmine.createSpyObj('player', [
            'getDuplicateInPlay',
            'getCostReduction',
            'getSpendableGold',
            'markUsedReducers'
        ]);
        this.cardSpy = jasmine.createSpyObj('card', [
            'getAmbushCost',
            'getCost',
            'getMinCost',
            'getShadowCost',
            'xValueDefinition'
        ]);
        this.cardSpy.getAmbushCost.and.returnValue(0);
        this.cardSpy.getCost.and.returnValue(0);
        this.cardSpy.getMinCost.and.returnValue(0);
        this.cardSpy.getShadowCost.and.returnValue(0);
        this.cardSpy.xValueDefinition = jasmine.createSpyObj('xValue', [
            'getMaxValue',
            'getMinValue'
        ]);
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            payingPlayer: this.playerSpy,
            source: this.cardSpy
        };
        this.cost = new ReduceableGoldCost({ playingType: 'playing-type' });
    });

    describe('canPay()', function () {
        beforeEach(function () {
            this.cardSpy.getCost.and.returnValue(0);
            this.playerSpy.getSpendableGold.and.returnValue(0);
            this.playerSpy.getCostReduction.and.returnValue(0);
        });

        it('should check that the player can spend the amount of gold', function () {
            this.cost.canPay(this.context);
            expect(this.playerSpy.getSpendableGold).toHaveBeenCalledWith(
                jasmine.objectContaining({ playingType: 'playing-type' })
            );
        });

        it('should return true when the player has enough gold after reducing the cost', function () {
            this.cardSpy.getCost.and.returnValue(8);
            this.playerSpy.getSpendableGold.and.returnValue(6);
            this.playerSpy.getCostReduction.and.returnValue(2);
            expect(this.cost.canPay(this.context)).toBe(true);
        });

        it('should check the cost properly', function () {
            this.cost.canPay(this.context);
            expect(this.playerSpy.getCostReduction).toHaveBeenCalledWith(
                'playing-type',
                this.cardSpy
            );
        });

        describe('when there is a duplicate in play', function () {
            beforeEach(function () {
                this.playerSpy.getDuplicateInPlay.and.returnValue({});
                this.cardSpy.getCost.and.returnValue(9);
                this.playerSpy.getSpendableGold.and.returnValue(6);
                this.playerSpy.getCostReduction.and.returnValue(0);
            });

            describe('and the play type is marshal', function () {
                beforeEach(function () {
                    this.cost = new ReduceableGoldCost({ playingType: 'marshal' });
                });

                it('should return true regardless of gold', function () {
                    this.playerSpy.getSpendableGold.and.returnValue(0);
                    expect(this.cost.canPay(this.context)).toBe(true);
                });
            });

            describe('and the play type is not marshal', function () {
                beforeEach(function () {
                    this.cost = new ReduceableGoldCost({ playingType: 'ambush' });
                });

                it('should return true if there is enough gold gold', function () {
                    this.cardSpy.getAmbushCost.and.returnValue(6);
                    this.playerSpy.getSpendableGold.and.returnValue(6);
                    this.playerSpy.getCostReduction.and.returnValue(0);
                    expect(this.cost.canPay(this.context)).toBe(true);
                });

                it('should return false if there is not enough gold gold', function () {
                    this.cardSpy.getAmbushCost.and.returnValue(6);
                    this.playerSpy.getSpendableGold.and.returnValue(5);
                    this.playerSpy.getCostReduction.and.returnValue(0);
                    expect(this.cost.canPay(this.context)).toBe(false);
                });
            });
        });

        describe('when there is not enough gold', function () {
            beforeEach(function () {
                this.cardSpy.getCost.and.returnValue(9);
                this.playerSpy.getSpendableGold.and.returnValue(6);
                this.playerSpy.getCostReduction.and.returnValue(2);
            });

            it('should return false', function () {
                expect(this.cost.canPay(this.context)).toBe(false);
            });
        });

        describe('when the card costs X', function () {
            beforeEach(function () {
                this.cardSpy.getCost.and.returnValue('X');
            });

            describe('when the player has enough gold for the min value after reduction', function () {
                beforeEach(function () {
                    this.cardSpy.xValueDefinition.getMinValue.and.returnValue(6);
                    this.playerSpy.getSpendableGold.and.returnValue(5);
                    this.playerSpy.getCostReduction.and.returnValue(1);
                });

                it('returns true', function () {
                    expect(this.cost.canPay(this.context)).toBe(true);
                });
            });

            describe('when the player does not have enough gold for the min value after reduction', function () {
                beforeEach(function () {
                    this.cardSpy.xValueDefinition.getMinValue.and.returnValue(7);
                    this.playerSpy.getSpendableGold.and.returnValue(5);
                    this.playerSpy.getCostReduction.and.returnValue(1);
                });

                it('returns false', function () {
                    expect(this.cost.canPay(this.context)).toBe(false);
                });
            });
        });
    });

    describe('pay()', function () {
        beforeEach(function () {
            this.cardSpy.getCost.and.returnValue(6);
            this.playerSpy.getSpendableGold.and.returnValue(6);
            this.playerSpy.getCostReduction.and.returnValue(3);
        });

        describe('when there is no duplicate in play', function () {
            beforeEach(function () {
                this.cost.pay(this.context);
            });

            it('should mark the gold cost as the reduced cost', function () {
                expect(this.context.costs.gold).toBe(3);
            });

            it('should mark the cost as not a duplicate', function () {
                expect(this.context.costs.isDupe).toBe(false);
            });

            it('should spend the players gold', function () {
                expect(this.gameSpy.spendGold).toHaveBeenCalledWith(
                    jasmine.objectContaining({ amount: 3, playingType: 'playing-type' })
                );
            });

            it('should mark any reducers as used', function () {
                expect(this.playerSpy.markUsedReducers).toHaveBeenCalledWith(
                    'playing-type',
                    this.cardSpy
                );
            });
        });

        describe('when there is a duplicate in play', function () {
            beforeEach(function () {
                this.playerSpy.getDuplicateInPlay.and.returnValue({});
            });

            describe('and the play type is marshal', function () {
                beforeEach(function () {
                    this.cost = new ReduceableGoldCost({ playingType: 'marshal' });
                    this.cost.pay(this.context);
                });

                it('should mark the gold cost as 0', function () {
                    expect(this.context.costs.gold).toBe(0);
                });

                it('should mark the cost as a duplicate', function () {
                    expect(this.context.costs.isDupe).toBe(true);
                });

                it('should not spend the players gold', function () {
                    expect(this.gameSpy.spendGold).not.toHaveBeenCalled();
                });

                it('should not mark any reducers as used', function () {
                    expect(this.playerSpy.markUsedReducers).not.toHaveBeenCalled();
                });
            });

            describe('and the play type is not marshal', function () {
                beforeEach(function () {
                    this.cardSpy.getAmbushCost.and.returnValue(6);
                    this.cost = new ReduceableGoldCost({ playingType: 'ambush' });
                    this.cost.pay(this.context);
                });

                it('should mark the gold cost as the reduced cost', function () {
                    expect(this.context.costs.gold).toBe(3);
                });

                it('should mark the cost as a duplicate', function () {
                    expect(this.context.costs.isDupe).toBe(true);
                });

                it('should spend the players gold', function () {
                    expect(this.gameSpy.spendGold).toHaveBeenCalledWith(
                        jasmine.objectContaining({ amount: 3, playingType: 'ambush' })
                    );
                });

                it('should mark any reducers as used', function () {
                    expect(this.playerSpy.markUsedReducers).toHaveBeenCalledWith(
                        'ambush',
                        this.cardSpy
                    );
                });
            });
        });

        describe('when the cost is X', function () {
            beforeEach(function () {
                this.cardSpy.getCost.and.returnValue('X');
            });

            it('should spend the players gold', function () {
                this.context.xValue = 5;
                this.playerSpy.getCostReduction.and.returnValue(1);

                this.cost.pay(this.context);

                expect(this.gameSpy.spendGold).toHaveBeenCalledWith(
                    jasmine.objectContaining({ amount: 4, playingType: 'playing-type' })
                );
            });
        });
    });
});
