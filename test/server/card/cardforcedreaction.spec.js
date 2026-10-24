import GameActions from '../../../server/game/GameActions/index.js';
import CardForcedReaction from '../../../server/game/cardforcedreaction.js';
import Event from '../../../server/game/event.js';

describe('CardForcedReaction', function () {
    beforeEach(function () {
        this.gameSpy = {
            on: vi.fn(),
            popAbilityContext: vi.fn(),
            pushAbilityContext: vi.fn(),
            removeListener: vi.fn(),
            registerAbility: vi.fn(),
            resolveGameAction: vi.fn()
        };
        this.cardSpy = {
            getPrintedType: vi.fn(),
            getType: vi.fn(),
            isAnyBlank: vi.fn(),
            createSnapshot: vi.fn()
        };
        this.cardSpy.location = 'play area';
        this.cardSpy.createSnapshot.mockReturnValue(this.cardSpy);
        this.limitSpy = {
            increment: vi.fn(),
            isAtMax: vi.fn(),
            registerEvents: vi.fn(),
            unregisterEvents: vi.fn()
        };

        this.properties = {
            when: {
                onSomething: vi.fn()
            },
            gameAction: GameActions.genericHandler(vi.fn(), () => true)
        };

        this.properties.when.onSomething.mockReturnValue(true);

        this.createReaction = () => {
            return new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
        };
    });

    describe('eventHandler()', function () {
        beforeEach(function () {
            this.executeEventHandler = (args = {}) => {
                this.event = new Event('onSomething', args);
                this.reaction = new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
                this.reaction.abilityTriggers[0].eventHandler(this.event);
            };
            this.executeAggregateEventHandler = () => {
                this.event = new Event('onSimultaneous');
                this.childEvent1 = new Event('onSomething', { arg1: 'val1', arg2: 'val2' });
                this.childEvent2 = new Event('onSomething', { arg1: 'val1', arg2: 'val3' });
                this.childEvent3 = new Event('onSomething', { arg1: 'val1', arg2: 'val3' });
                this.event.addChildEvent(this.childEvent1);
                this.event.addChildEvent(this.childEvent2);
                this.event.addChildEvent(this.childEvent3);
                this.reaction = new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);

                this.reaction.abilityTriggers[0].eventHandler(this.event);
            };
        });

        it('should call the when handler with the appropriate arguments', function () {
            this.executeEventHandler();
            expect(this.properties.when.onSomething).toHaveBeenCalledWith(
                this.event,
                expect.anything()
            );
        });

        describe('when the singular condition returns false', function () {
            beforeEach(function () {
                this.properties.when.onSomething.mockReturnValue(false);
                this.executeEventHandler();
            });

            it('should not register the ability', function () {
                expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the aggregate condition returns false', function () {
            beforeEach(function () {
                this.properties.when.onSomething = {
                    aggregateBy: () => ({}),
                    condition: () => false
                };
                this.executeAggregateEventHandler();
            });

            it('should not register any abilities', function () {
                expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the singular condition returns true', function () {
            beforeEach(function () {
                this.properties.when.onSomething.mockReturnValue(true);
                this.executeEventHandler();
            });

            it('should register the ability', function () {
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(
                    this.reaction,
                    expect.objectContaining({
                        ability: this.reaction,
                        event: this.event,
                        game: this.gameSpy,
                        source: this.cardSpy
                    })
                );
            });
        });

        describe('when the aggregate condition returns one true', function () {
            beforeEach(function () {
                this.properties.when.onSomething = {
                    aggregateBy: (event) => ({
                        arg1: event.arg1,
                        arg2: event.arg2
                    }),
                    condition: (aggregate) => aggregate.arg2 === 'val2'
                };
                this.executeAggregateEventHandler();
            });

            it('should only register the one ability', function () {
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(
                    this.reaction,
                    expect.objectContaining({
                        events: expect.arrayContaining([this.childEvent1])
                    })
                );
                expect(this.gameSpy.registerAbility.mock.calls.length).toBe(1);
            });
        });

        describe('when the aggregate condition returns multiple true', function () {
            beforeEach(function () {
                this.properties.when.onSomething = {
                    aggregateBy: (event) => ({
                        arg1: event.arg1,
                        arg2: event.arg2
                    }),
                    condition: (aggregate) => aggregate.arg1 === 'val1'
                };
                this.executeAggregateEventHandler();
            });

            it('should register each ability grouped by aggregate', function () {
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(
                    this.reaction,
                    expect.objectContaining({
                        aggregate: expect.objectContaining({ arg1: 'val1', arg2: 'val2' }),
                        events: expect.arrayContaining([this.childEvent1])
                    })
                );
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(
                    this.reaction,
                    expect.objectContaining({
                        aggregate: expect.objectContaining({ arg1: 'val1', arg2: 'val3' }),
                        events: expect.arrayContaining([this.childEvent2, this.childEvent3])
                    })
                );
                expect(this.gameSpy.registerAbility.mock.calls.length).toBe(2);
            });
        });
    });

    describe('meetsRequirements()', function () {
        beforeEach(function () {
            this.meetsRequirements = () => {
                this.event = new Event('onSomething', {});
                this.reaction = new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
                this.context = this.reaction.createContext(this.event);
                return this.reaction.meetsRequirements(this.context);
            };
        });

        it('should call the when handler with the appropriate arguments', function () {
            this.meetsRequirements();
            expect(this.properties.when.onSomething).toHaveBeenCalledWith(
                this.event,
                expect.anything()
            );
        });

        describe('when in the setup phase', function () {
            beforeEach(function () {
                this.gameSpy.currentPhase = 'setup';
            });

            it('should return false', function () {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when the card has been blanked', function () {
            beforeEach(function () {
                this.cardSpy.isAnyBlank.mockReturnValue(true);
            });

            it('should return false', function () {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when the singular condition returns false', function () {
            beforeEach(function () {
                this.properties.when.onSomething.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when the aggregate condition returns false', function () {
            beforeEach(function () {
                this.properties.when.onSomething = {
                    aggregateBy: vi.fn().mockReturnValue({}),
                    condition: vi.fn().mockReturnValue(false)
                };
            });

            it('should return false', function () {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when the card is not in the proper location', function () {
            beforeEach(function () {
                this.cardSpy.location = 'foo';
            });

            it('should return false', function () {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when there is a limit', function () {
            beforeEach(function () {
                this.properties.limit = this.limitSpy;
            });

            describe('and the limit has been reached', function () {
                beforeEach(function () {
                    this.limitSpy.isAtMax.mockReturnValue(true);
                });

                it('should return false', function () {
                    expect(this.meetsRequirements()).toBe(false);
                });
            });

            describe('and the limit has not been reached', function () {
                beforeEach(function () {
                    this.limitSpy.isAtMax.mockReturnValue(false);
                });

                it('should return true', function () {
                    expect(this.meetsRequirements()).toBe(true);
                });
            });
        });
    });

    describe('executeHandler', function () {
        beforeEach(function () {
            this.reaction = new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
            this.context = { context: 1, game: this.gameSpy };
        });

        it('resolve the game action', function () {
            this.reaction.executeHandler(this.context);
            expect(this.gameSpy.resolveGameAction).toHaveBeenCalledWith(
                expect.any(Object),
                this.context
            );
        });
    });

    describe('registerEvents()', function () {
        beforeEach(function () {
            this.properties = {
                when: {
                    onFoo: () => true,
                    onBar: () => true,
                    onAgg: {
                        aggregateBy: {},
                        condition: () => true
                    }
                },
                gameAction: GameActions.genericHandler(
                    () => true,
                    () => true
                )
            };
            this.reaction = this.createReaction();
            this.reaction.registerEvents();
        });

        it('should register all when event handlers with the proper event type suffix', function () {
            expect(this.gameSpy.on).toHaveBeenCalledWith(
                'onFoo:forcedreaction',
                expect.any(Function)
            );
            expect(this.gameSpy.on).toHaveBeenCalledWith(
                'onBar:forcedreaction',
                expect.any(Function)
            );
        });

        it('should register a singular event with no suffix for aggregates', function () {
            expect(this.gameSpy.on).toHaveBeenCalledWith('forcedreaction', expect.any(Function));
        });

        it('should not reregister events already registered', function () {
            expect(this.gameSpy.on.mock.calls.length).toBe(3);
            this.reaction.registerEvents();
            expect(this.gameSpy.on.mock.calls.length).toBe(3);
        });
    });

    describe('unregisterEvents', function () {
        beforeEach(function () {
            this.properties = {
                when: {
                    onFoo: () => true,
                    onBar: () => true,
                    onAgg: {
                        aggregateBy: {},
                        condition: () => true
                    }
                },
                gameAction: GameActions.genericHandler(
                    () => true,
                    () => true
                )
            };
            this.reaction = this.createReaction();
        });

        it('should unregister all previously registered when event handlers', function () {
            this.reaction.registerEvents();
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith(
                'onFoo:forcedreaction',
                expect.any(Function)
            );
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith(
                'onBar:forcedreaction',
                expect.any(Function)
            );
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith(
                'forcedreaction',
                expect.any(Function)
            );
        });

        it('should not remove listeners when they have not been registered', function () {
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener).not.toHaveBeenCalled();
        });

        it('should not unregister events already unregistered', function () {
            this.reaction.registerEvents();
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener.mock.calls.length).toBe(3);
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener.mock.calls.length).toBe(3);
        });
    });
});
