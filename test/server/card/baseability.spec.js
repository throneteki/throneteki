/*global describe, it, beforeEach, expect, jasmine */
/*eslint camelcase: 0, no-invalid-this: 0 */

const BaseAbility = require('../../../server/game/baseability.js');

const AbilityResolver = require('../../../server/game/gamesteps/abilityresolver.js');

describe('BaseAbility', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['queueStep']);

        this.cardSpy = jasmine.createSpyObj('card', ['']);
        this.properties = {};
    });

    describe('constructor', function() {
        describe('cost', function() {
            describe('when no cost is passed', function() {
                beforeEach(function() {
                    delete this.properties.cost;
                    this.ability = new BaseAbility(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should set cost to be empty array', function() {
                    expect(this.ability.cost).toEqual([]);
                });
            });

            describe('when a single cost is passed', function() {
                beforeEach(function() {
                    this.cost = { cost: 1 };
                    this.properties.cost = this.cost;
                    this.ability = new BaseAbility(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should set cost to be an array with the cost', function() {
                    expect(this.ability.cost).toEqual([this.cost]);
                });
            });

            describe('when multiple costs are passed', function() {
                beforeEach(function() {
                    this.cost1 = { cost: 1 };
                    this.cost2 = { cost: 2 };
                    this.properties.cost = [this.cost1, this.cost2];
                    this.ability = new BaseAbility(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should set cost to be the array', function() {
                    expect(this.ability.cost).toEqual([this.cost1, this.cost2]);
                });
            });
        });
    });

    describe('queueResolver()', function() {
        beforeEach(function() {
            this.context = { context: true };
            this.ability = new BaseAbility(this.gameSpy, this.cardSpy, this.properties);
            this.ability.queueResolver(this.context);
        });

        it('should queue an AbilityResolver step onto game', function() {
            expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(AbilityResolver));
        });
    });

    describe('checkIfCanPayCosts()', function() {
        beforeEach(function() {
            this.cost1 = jasmine.createSpyObj('cost1', ['canPay']);
            this.cost2 = jasmine.createSpyObj('cost1', ['canPay']);
            this.cost1.canPay.and.returnValue(1);
            this.cost2.canPay.and.returnValue(2);
            this.ability = new BaseAbility(this.gameSpy, this.cardSpy, this.properties);
            this.ability.cost = [this.cost1, this.cost2];
            this.context = { context: 1 };
        });

        it('should call canPay with the context object', function() {
            this.ability.checkIfCanPayCosts(this.context);
            expect(this.cost1.canPay).toHaveBeenCalledWith(this.context);
            expect(this.cost2.canPay).toHaveBeenCalledWith(this.context);
        });

        it('should return the results of the canPay method for all costs', function() {
            expect(this.ability.checkIfCanPayCosts(this.context)).toEqual([1, 2]);
        });
    });

    describe('payCosts()', function() {
        beforeEach(function() {
            this.cost1 = jasmine.createSpyObj('cost1', ['pay']);
            this.cost2 = jasmine.createSpyObj('cost1', ['pay']);
            this.ability = new BaseAbility(this.gameSpy, this.cardSpy, this.properties);
            this.ability.cost = [this.cost1, this.cost2];
            this.context = { context: 1 };
        });

        it('should call pay with the context object', function() {
            this.ability.payCosts(this.context);
            expect(this.cost1.pay).toHaveBeenCalledWith(this.context);
            expect(this.cost2.pay).toHaveBeenCalledWith(this.context);
        });
    });
});
