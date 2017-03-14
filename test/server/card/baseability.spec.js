/*global describe, it, beforeEach, expect, jasmine */
/*eslint camelcase: 0, no-invalid-this: 0 */

const BaseAbility = require('../../../server/game/baseability.js');

describe('BaseAbility', function () {
    beforeEach(function () {
        this.properties = {};
    });

    describe('constructor', function() {
        describe('cost', function() {
            describe('when no cost is passed', function() {
                beforeEach(function() {
                    delete this.properties.cost;
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set cost to be empty array', function() {
                    expect(this.ability.cost).toEqual([]);
                });
            });

            describe('when a single cost is passed', function() {
                beforeEach(function() {
                    this.cost = { cost: 1 };
                    this.properties.cost = this.cost;
                    this.ability = new BaseAbility(this.properties);
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
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set cost to be the array', function() {
                    expect(this.ability.cost).toEqual([this.cost1, this.cost2]);
                });
            });
        });

        describe('targets', function() {
            describe('when no target is passed', function() {
                beforeEach(function() {
                    delete this.properties.target;
                    delete this.properties.targets;
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set cost to be empty object', function() {
                    expect(this.ability.targets).toEqual({});
                });
            });

            describe('when a single target is passed using target', function() {
                beforeEach(function() {
                    this.target = { foo: 'bar' };
                    this.properties.target = this.target;
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set the target sub-property of targets', function() {
                    expect(this.ability.targets.target).toEqual(this.target);
                });
            });

            describe('when targets are passed using targets', function() {
                beforeEach(function() {
                    this.target1 = { foo: 'bar' };
                    this.target2 = { bar: 'baz' };
                    this.properties.targets = { toKill: this.target1, toSave: this.target2 };
                    this.ability = new BaseAbility(this.properties);
                });

                it('should set all targets', function() {
                    expect(this.ability.targets.toKill).toEqual(this.target1);
                    expect(this.ability.targets.toSave).toEqual(this.target2);
                });
            });
        });
    });

    describe('canPayCosts()', function() {
        beforeEach(function() {
            this.cost1 = jasmine.createSpyObj('cost1', ['canPay']);
            this.cost2 = jasmine.createSpyObj('cost1', ['canPay']);
            this.ability = new BaseAbility(this.properties);
            this.ability.cost = [this.cost1, this.cost2];
            this.context = { context: 1 };
        });

        describe('when all costs can be paid', function() {
            beforeEach(function() {
                this.cost1.canPay.and.returnValue(true);
                this.cost2.canPay.and.returnValue(true);
            });

            it('should call canPay with the context object', function() {
                this.ability.canPayCosts(this.context);
                expect(this.cost1.canPay).toHaveBeenCalledWith(this.context);
                expect(this.cost2.canPay).toHaveBeenCalledWith(this.context);
            });

            it('should return true', function() {
                expect(this.ability.canPayCosts(this.context)).toBe(true);
            });
        });

        describe('when any cost cannot be paid', function() {
            beforeEach(function() {
                this.cost1.canPay.and.returnValue(true);
                this.cost2.canPay.and.returnValue(false);
            });

            it('should return false', function() {
                expect(this.ability.canPayCosts(this.context)).toBe(false);
            });
        });
    });

    describe('resolveCosts()', function() {
        beforeEach(function() {
            this.noResolveCost = jasmine.createSpyObj('cost1', ['canPay']);
            this.resolveCost = jasmine.createSpyObj('cost2', ['canPay', 'resolve']);
            this.ability = new BaseAbility(this.properties);

            this.context = { context: 1 };
        });

        describe('when the cost does not have a resolve method', function() {
            beforeEach(function() {
                this.ability.cost = [this.noResolveCost];
                this.noResolveCost.canPay.and.returnValue('value1');

                this.results = this.ability.resolveCosts(this.context);
            });

            it('should call canPay on the cost', function() {
                expect(this.noResolveCost.canPay).toHaveBeenCalledWith(this.context);
            });

            it('should return the cost in resolved format', function() {
                expect(this.results).toEqual([{ resolved: true, value: 'value1' }]);
            });
        });

        describe('when the cost has a resolve method', function() {
            beforeEach(function() {
                this.ability.cost = [this.resolveCost];
                this.resolveCost.resolve.and.returnValue({ resolved: false });

                this.results = this.ability.resolveCosts(this.context);
            });

            it('should not call canPay on the cost', function() {
                expect(this.resolveCost.canPay).not.toHaveBeenCalled();
            });

            it('should call resolve on the cost', function() {
                expect(this.resolveCost.resolve).toHaveBeenCalledWith(this.context);
            });

            it('should return the result of resolve', function() {
                expect(this.results).toEqual([{ resolved: false }]);
            });
        });
    });

    describe('payCosts()', function() {
        beforeEach(function() {
            this.cost1 = jasmine.createSpyObj('cost1', ['pay']);
            this.cost2 = jasmine.createSpyObj('cost1', ['pay']);
            this.ability = new BaseAbility(this.properties);
            this.ability.cost = [this.cost1, this.cost2];
            this.context = { context: 1 };
        });

        it('should call pay with the context object', function() {
            this.ability.payCosts(this.context);
            expect(this.cost1.pay).toHaveBeenCalledWith(this.context);
            expect(this.cost2.pay).toHaveBeenCalledWith(this.context);
        });
    });

    describe('resolveTargets()', function() {
        beforeEach(function() {
            this.gameSpy = jasmine.createSpyObj('game', ['promptForSelect']);
            this.player = { player: 1 };
            this.source = { source: 1 };

            this.target1 = { target: 1 };
            this.target2 = { target: 2 };
            this.ability = new BaseAbility(this.properties);
            this.ability.targets.target1 = this.target1;
            this.ability.targets.target2 = this.target2;

            this.context = { game: this.gameSpy, player: this.player, source: this.source };
        });

        it('should return target results for each target', function() {
            expect(this.ability.resolveTargets(this.context)).toEqual([{ resolved: false, name: 'target1', value: null }, { resolved: false, name: 'target2', value: null }]);
        });

        it('should prompt the player to select each target', function() {
            this.ability.resolveTargets(this.context);
            expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, { source: this.source, target: 1, onSelect: jasmine.any(Function), onCancel: jasmine.any(Function)});
            expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(this.player, { source: this.source, target: 2, onSelect: jasmine.any(Function), onCancel: jasmine.any(Function)});
        });

        describe('the select prompt', function() {
            beforeEach(function() {
                var results = this.ability.resolveTargets(this.context);
                this.lastResult = results[1];
                var call = this.gameSpy.promptForSelect.calls.mostRecent();
                this.lastPromptProperties = call.args[1];
            });

            describe('when a card is selected', function() {
                beforeEach(function() {
                    this.lastPromptProperties.onSelect(this.player, 'foo');
                });

                it('should resolve the result', function() {
                    expect(this.lastResult.resolved).toBe(true);
                });

                it('should set the result value', function() {
                    expect(this.lastResult.value).toBe('foo');
                });
            });

            describe('when the prompt is cancelled', function() {
                beforeEach(function() {
                    this.lastPromptProperties.onCancel();
                });

                it('should resolve the result', function() {
                    expect(this.lastResult.resolved).toBe(true);
                });

                it('should not set the result value', function() {
                    expect(this.lastResult.value).toBeFalsy();
                });
            });
        });
    });
});
