import ReduceableGoldCost from '../../../server/game/costs/ReduceableGoldCost.js';

describe('ReduceableGoldCost', function () {
    beforeEach(function () {
        this.gameSpy = { addMessage: vi.fn(), spendGold: vi.fn() };
        this.playerSpy = {
            getDuplicateInPlay: vi.fn(),
            getCostReduction: vi.fn(),
            getSpendableGold: vi.fn(),
            markUsedReducers: vi.fn()
        };
        this.cardSpy = {
            getAmbushCost: vi.fn(),
            getCost: vi.fn(),
            getMinCost: vi.fn(),
            getShadowCost: vi.fn(),
            xValueDefinition: vi.fn()
        };
        this.cardSpy.getAmbushCost.mockReturnValue(0);
        this.cardSpy.getCost.mockReturnValue(0);
        this.cardSpy.getMinCost.mockReturnValue(0);
        this.cardSpy.getShadowCost.mockReturnValue(0);
        this.cardSpy.xValueDefinition = { getMaxValue: vi.fn(), getMinValue: vi.fn() };
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
            this.cardSpy.getCost.mockReturnValue(0);
            this.playerSpy.getSpendableGold.mockReturnValue(0);
            this.playerSpy.getCostReduction.mockReturnValue(0);
        });

        it('should check that the player can spend the amount of gold', function () {
            this.cost.canPay(this.context);
            expect(this.playerSpy.getSpendableGold).toHaveBeenCalledWith(
                expect.objectContaining({ playingType: 'playing-type' })
            );
        });

        it('should return true when the player has enough gold after reducing the cost', function () {
            this.cardSpy.getCost.mockReturnValue(8);
            this.playerSpy.getSpendableGold.mockReturnValue(6);
            this.playerSpy.getCostReduction.mockReturnValue(2);
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
                this.playerSpy.getDuplicateInPlay.mockReturnValue({});
                this.cardSpy.getCost.mockReturnValue(9);
                this.playerSpy.getSpendableGold.mockReturnValue(6);
                this.playerSpy.getCostReduction.mockReturnValue(0);
            });

            describe('and the play type is marshal', function () {
                beforeEach(function () {
                    this.cost = new ReduceableGoldCost({ playingType: 'marshal' });
                });

                it('should return true regardless of gold', function () {
                    this.playerSpy.getSpendableGold.mockReturnValue(0);
                    expect(this.cost.canPay(this.context)).toBe(true);
                });
            });

            describe('and the play type is not marshal', function () {
                beforeEach(function () {
                    this.cost = new ReduceableGoldCost({ playingType: 'ambush' });
                });

                it('should return true if there is enough gold gold', function () {
                    this.cardSpy.getAmbushCost.mockReturnValue(6);
                    this.playerSpy.getSpendableGold.mockReturnValue(6);
                    this.playerSpy.getCostReduction.mockReturnValue(0);
                    expect(this.cost.canPay(this.context)).toBe(true);
                });

                it('should return false if there is not enough gold gold', function () {
                    this.cardSpy.getAmbushCost.mockReturnValue(6);
                    this.playerSpy.getSpendableGold.mockReturnValue(5);
                    this.playerSpy.getCostReduction.mockReturnValue(0);
                    expect(this.cost.canPay(this.context)).toBe(false);
                });
            });
        });

        describe('when there is not enough gold', function () {
            beforeEach(function () {
                this.cardSpy.getCost.mockReturnValue(9);
                this.playerSpy.getSpendableGold.mockReturnValue(6);
                this.playerSpy.getCostReduction.mockReturnValue(2);
            });

            it('should return false', function () {
                expect(this.cost.canPay(this.context)).toBe(false);
            });
        });

        describe('when the card costs X', function () {
            beforeEach(function () {
                this.cardSpy.getCost.mockReturnValue('X');
            });

            describe('when the player has enough gold for the min value after reduction', function () {
                beforeEach(function () {
                    this.cardSpy.xValueDefinition.getMinValue.mockReturnValue(6);
                    this.playerSpy.getSpendableGold.mockReturnValue(5);
                    this.playerSpy.getCostReduction.mockReturnValue(1);
                });

                it('returns true', function () {
                    expect(this.cost.canPay(this.context)).toBe(true);
                });
            });

            describe('when the player does not have enough gold for the min value after reduction', function () {
                beforeEach(function () {
                    this.cardSpy.xValueDefinition.getMinValue.mockReturnValue(7);
                    this.playerSpy.getSpendableGold.mockReturnValue(5);
                    this.playerSpy.getCostReduction.mockReturnValue(1);
                });

                it('returns false', function () {
                    expect(this.cost.canPay(this.context)).toBe(false);
                });
            });
        });
    });

    describe('pay()', function () {
        beforeEach(function () {
            this.cardSpy.getCost.mockReturnValue(6);
            this.playerSpy.getSpendableGold.mockReturnValue(6);
            this.playerSpy.getCostReduction.mockReturnValue(3);
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
                    expect.objectContaining({ amount: 3, playingType: 'playing-type' })
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
                this.playerSpy.getDuplicateInPlay.mockReturnValue({});
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
                    this.cardSpy.getAmbushCost.mockReturnValue(6);
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
                        expect.objectContaining({ amount: 3, playingType: 'ambush' })
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
                this.cardSpy.getCost.mockReturnValue('X');
            });

            it('should spend the players gold', function () {
                this.context.xValue = 5;
                this.playerSpy.getCostReduction.mockReturnValue(1);

                this.cost.pay(this.context);

                expect(this.gameSpy.spendGold).toHaveBeenCalledWith(
                    expect.objectContaining({ amount: 4, playingType: 'playing-type' })
                );
            });
        });
    });
});
