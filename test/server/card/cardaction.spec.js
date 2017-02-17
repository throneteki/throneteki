/*global describe, it, beforeEach, expect, jasmine, spyOn */
/*eslint camelcase: 0, no-invalid-this: 0 */

const CardAction = require('../../../server/game/cardaction.js');

const AbilityResolver = require('../../../server/game/gamesteps/abilityresolver.js');

describe('CardAction', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'queueStep']);
        this.gameSpy.currentPhase = 'marshal';

        this.cardSpy = jasmine.createSpyObj('card', ['isBlank']);
        this.cardSpy.handler = function() {};
        spyOn(this.cardSpy, 'handler').and.returnValue(true);

        this.limitSpy = jasmine.createSpyObj('limit', ['increment', 'isAtMax', 'registerEvents', 'unregisterEvents']);

        this.properties = {
            title: 'Do the thing',
            method: 'handler'
        };
    });

    describe('constructor', function() {
        describe('handler', function() {
            beforeEach(function() {
                this.context = {
                    player: 'player',
                    arg: 'arg',
                    foo: 'bar'
                };
            });

            describe('when passed a method reference', function() {
                beforeEach(function() {
                    this.properties = {
                        title: 'Do the thing',
                        method: 'handler'
                    };
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should use the specified method on the card object', function() {
                    this.action.handler(this.context);
                    expect(this.cardSpy.handler).toHaveBeenCalledWith('player', 'arg', this.context);
                });
            });

            describe('when passed a handler directly', function() {
                beforeEach(function() {
                    this.properties = {
                        title: 'Do the thing',
                        handler: jasmine.createSpy('handler')
                    };
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should use the handler directly', function() {
                    this.action.handler(this.context);
                    expect(this.properties.handler).toHaveBeenCalledWith(this.context);
                });
            });
        });

        describe('cost', function() {
            describe('when no cost is passed', function() {
                beforeEach(function() {
                    delete this.properties.cost;
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should set cost to be empty array', function() {
                    expect(this.action.cost).toEqual([]);
                });
            });

            describe('when a single cost is passed', function() {
                beforeEach(function() {
                    this.cost = { cost: 1 };
                    this.properties.cost = this.cost;
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should set cost to be an array with the cost', function() {
                    expect(this.action.cost).toEqual([this.cost]);
                });
            });

            describe('when multiple costs are passed', function() {
                beforeEach(function() {
                    this.cost1 = { cost: 1 };
                    this.cost2 = { cost: 2 };
                    this.properties.cost = [this.cost1, this.cost2];
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                });

                it('should set cost to be the array', function() {
                    expect(this.action.cost).toEqual([this.cost1, this.cost2]);
                });
            });
        });
    });

    describe('execute()', function() {
        beforeEach(function() {
            this.player = {};
            this.cardSpy.controller = this.player;
        });

        describe('when the action has limited uses', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the use count has reached the limit', function() {
                beforeEach(function() {
                    this.limitSpy.isAtMax.and.returnValue(true);

                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function() {
                    expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
                });
            });

            describe('and the use count is below the limit', function() {
                beforeEach(function() {
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function() {
                    expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(AbilityResolver));
                });
            });
        });

        describe('when executed with a player other than the card controller', function() {
            beforeEach(function() {
                this.otherPlayer = {};
            });

            describe('and the anyPlayer property is not set', function() {
                beforeEach(function() {
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    this.action.execute(this.otherPlayer, 'arg');
                });

                it('should not queue the ability resolver', function() {
                    expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
                });
            });

            describe('and the anyPlayer property is set', function() {
                beforeEach(function() {
                    this.properties.anyPlayer = true;
                    this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                    this.action.execute(this.otherPlayer, 'arg');
                });

                it('should queue the ability resolver', function() {
                    expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(AbilityResolver));
                });
            });
        });

        describe('when the card is blank', function() {
            beforeEach(function() {
                this.cardSpy.isBlank.and.returnValue(true);
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not queue the ability resolver', function() {
                expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
            });
        });

        describe('when only allowed in a certain phase', function() {
            beforeEach(function() {
                this.properties.phase = 'challenge';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and it is not that phase', function() {
                beforeEach(function() {
                    this.gameSpy.currentPhase = 'dominance';
                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function() {
                    expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
                });
            });

            describe('and it is the phase', function() {
                beforeEach(function() {
                    this.gameSpy.currentPhase = 'challenge';
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function() {
                    expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(AbilityResolver));
                });
            });
        });

        describe('when the current phase is setup', function() {
            beforeEach(function() {
                this.gameSpy.currentPhase = 'setup';
                this.properties.phase = 'any';
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should not queue the ability resolver', function() {
                expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
            });
        });

        describe('when a condition is provided', function() {
            beforeEach(function() {
                this.condition = jasmine.createSpy('condition');
                this.properties.condition = this.condition;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the condition returns true', function() {
                beforeEach(function() {
                    this.condition.and.returnValue(true);
                    this.action.execute(this.player, 'arg');
                });

                it('should queue the ability resolver', function() {
                    expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(AbilityResolver));
                });
            });

            describe('and the condition returns false', function() {
                beforeEach(function() {
                    this.condition.and.returnValue(false);
                    this.action.execute(this.player, 'arg');
                });

                it('should not queue the ability resolver', function() {
                    expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
                });
            });
        });

        describe('when all conditions met', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.execute(this.player, 'arg');
            });

            it('should queue the ability resolver', function() {
                expect(this.gameSpy.queueStep).toHaveBeenCalledWith(jasmine.any(AbilityResolver));
            });
        });
    });

    describe('registerEvents()', function() {
        describe('when there is no limit', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should not register an event', function() {
                expect(this.limitSpy.registerEvents).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.registerEvents();
            });

            it('should register events for the limit', function() {
                expect(this.limitSpy.registerEvents).toHaveBeenCalledWith(this.gameSpy);
            });
        });
    });

    describe('unregisterEvents()', function() {
        describe('when there is no limit', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);

                this.action.unregisterEvents();
            });

            it('should not unregister an event', function() {
                expect(this.limitSpy.unregisterEvents).not.toHaveBeenCalled();
            });
        });

        describe('when there is a limit', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);

                this.action.unregisterEvents();
            });

            it('should unregister events for the limit', function() {
                expect(this.limitSpy.unregisterEvents).toHaveBeenCalledWith(this.gameSpy);
            });
        });
    });

    describe('getMenuItem()', function() {
        beforeEach(function() {
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.menuItem = this.action.getMenuItem();
        });

        it('returns the menu item format', function() {
            expect(this.menuItem).toEqual({ text: 'Do the thing', method: 'doAction', anyPlayer: false });
        });
    });

    describe('checkIfCanPayCosts()', function() {
        beforeEach(function() {
            this.cost1 = jasmine.createSpyObj('cost1', ['canPay']);
            this.cost2 = jasmine.createSpyObj('cost1', ['canPay']);
            this.cost1.canPay.and.returnValue(1);
            this.cost2.canPay.and.returnValue(2);
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.action.cost = [this.cost1, this.cost2];
        });

        it('should return the results of the canPay method for all costs', function() {
            expect(this.action.checkIfCanPayCosts()).toEqual([1, 2]);
        });
    });

    describe('checkIfCanPayCosts()', function() {
        beforeEach(function() {
            this.cost1 = jasmine.createSpyObj('cost1', ['canPay']);
            this.cost2 = jasmine.createSpyObj('cost1', ['canPay']);
            this.cost1.canPay.and.returnValue(1);
            this.cost2.canPay.and.returnValue(2);
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.action.cost = [this.cost1, this.cost2];
            this.context = { context: 1 };
        });

        it('should call canPay with the context object', function() {
            this.action.checkIfCanPayCosts(this.context);
            expect(this.cost1.canPay).toHaveBeenCalledWith(this.context);
            expect(this.cost2.canPay).toHaveBeenCalledWith(this.context);
        });

        it('should return the results of the canPay method for all costs', function() {
            expect(this.action.checkIfCanPayCosts(this.context)).toEqual([1, 2]);
        });
    });

    describe('payCosts()', function() {
        beforeEach(function() {
            this.cost1 = jasmine.createSpyObj('cost1', ['pay']);
            this.cost2 = jasmine.createSpyObj('cost1', ['pay']);
            this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            this.action.cost = [this.cost1, this.cost2];
            this.context = { context: 1 };
        });

        it('should call pay with the context object', function() {
            this.action.payCosts(this.context);
            expect(this.cost1.pay).toHaveBeenCalledWith(this.context);
            expect(this.cost2.pay).toHaveBeenCalledWith(this.context);
        });
    });

    describe('executeHandler()', function() {
        beforeEach(function() {
            this.player = { player: true };
            this.context = {
                player: this.player,
                arg: 'arg'
            };
            this.handler = jasmine.createSpy('handler');
            this.properties.handler = this.handler;
        });

        describe('when the action has no limit', function() {
            beforeEach(function() {
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
                this.action.executeHandler(this.context);
            });

            it('should call the handler', function() {
                expect(this.handler).toHaveBeenCalledWith(this.context);
            });
        });

        describe('when the action has limited uses', function() {
            beforeEach(function() {
                this.properties.limit = this.limitSpy;
                this.action = new CardAction(this.gameSpy, this.cardSpy, this.properties);
            });

            describe('and the handler returns false', function() {
                beforeEach(function() {
                    this.handler.and.returnValue(false);

                    this.action.executeHandler(this.context);
                });

                it('should call the handler', function() {
                    expect(this.handler).toHaveBeenCalledWith(this.context);
                });

                it('should not count towards the limit', function() {
                    expect(this.limitSpy.increment).not.toHaveBeenCalled();
                });
            });

            describe('and the handler returns undefined or a non-false value', function() {
                beforeEach(function() {
                    this.handler.and.returnValue(undefined);

                    this.action.executeHandler(this.context);
                });

                it('should call the handler', function() {
                    expect(this.handler).toHaveBeenCalledWith(this.context);
                });

                it('should count towards the limit', function() {
                    expect(this.limitSpy.increment).toHaveBeenCalled();
                });
            });
        });
    });
});
