import CardForcedReaction from '../../../server/game/cardforcedreaction.js';
import Event from '../../../server/game/event.js';

describe('CardForcedReaction', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'on',
            'popAbilityContext',
            'pushAbilityContext',
            'removeListener',
            'registerAbility',
            'resolveGameAction'
        ]);
        this.cardSpy = jasmine.createSpyObj('card', [
            'getPrintedType',
            'getType',
            'isAnyBlank',
            'createSnapshot'
        ]);
        this.cardSpy.location = 'play area';
        this.cardSpy.createSnapshot.and.returnValue(this.cardSpy);
        this.limitSpy = jasmine.createSpyObj('limit', [
            'increment',
            'isAtMax',
            'registerEvents',
            'unregisterEvents'
        ]);

        this.properties = {
            when: {
                onSomething: jasmine.createSpy('when condition')
            },
            handler: jasmine.createSpy('handler')
        };

        this.properties.when.onSomething.and.returnValue(true);

        this.createReaction = () => {
            return new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
        };
    });

    describe('eventHandler()', function () {
        beforeEach(function () {
            this.executeEventHandler = (args = {}) => {
                this.event = new Event('onSomething', args);
                this.reaction = new CardForcedReaction(this.gameSpy, this.cardSpy, this.properties);
                this.reaction.eventHandler(this.event);
            };
        });

        it('should call the when handler with the appropriate arguments', function () {
            this.executeEventHandler();
            expect(this.properties.when.onSomething).toHaveBeenCalledWith(
                this.event,
                jasmine.anything()
            );
        });

        describe('when the when condition returns false', function () {
            beforeEach(function () {
                this.properties.when.onSomething.and.returnValue(false);
                this.executeEventHandler();
            });

            it('should not register the ability', function () {
                expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the when condition returns true', function () {
            beforeEach(function () {
                this.properties.when.onSomething.and.returnValue(true);
                this.executeEventHandler();
            });

            it('should register the ability', function () {
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(
                    this.reaction,
                    this.event
                );
            });
        });

        describe('when the when aggregate returns false', function () {
            beforeEach(function () {
                this.properties.when.onSomething = {
                    aggregateBy: jasmine.createSpy().and.returnValue({}),
                    condition: jasmine.createSpy().and.returnValue(false)
                };
                this.executeEventHandler();
            });

            it('should not register the ability', function () {
                expect(this.gameSpy.registerAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the when aggregate returns true', function () {
            beforeEach(function () {
                this.properties.when.onSomething = {
                    aggregateBy: jasmine.createSpy().and.returnValue({}),
                    condition: jasmine.createSpy().and.returnValue(true)
                };
                this.executeEventHandler();
            });

            it('should register the ability', function () {
                expect(this.gameSpy.registerAbility).toHaveBeenCalled();
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
                jasmine.anything()
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
                this.cardSpy.isAnyBlank.and.returnValue(true);
            });

            it('should return false', function () {
                expect(this.meetsRequirements()).toBe(false);
            });
        });

        describe('when the when condition returns false', function () {
            beforeEach(function () {
                this.properties.when.onSomething.and.returnValue(false);
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
                    this.limitSpy.isAtMax.and.returnValue(true);
                });

                it('should return false', function () {
                    expect(this.meetsRequirements()).toBe(false);
                });
            });

            describe('and the limit has not been reached', function () {
                beforeEach(function () {
                    this.limitSpy.isAtMax.and.returnValue(false);
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
                jasmine.any(Object),
                this.context
            );
        });
    });

    describe('registerEvents()', function () {
        beforeEach(function () {
            this.properties = {
                when: {
                    onFoo: () => true,
                    onBar: () => true
                },
                handler: () => true
            };
            this.reaction = this.createReaction();
            this.reaction.registerEvents();
        });

        it('should register all when event handlers with the proper event type suffix', function () {
            expect(this.gameSpy.on).toHaveBeenCalledWith(
                'onFoo:forcedreaction',
                jasmine.any(Function)
            );
            expect(this.gameSpy.on).toHaveBeenCalledWith(
                'onBar:forcedreaction',
                jasmine.any(Function)
            );
        });

        it('should not reregister events already registered', function () {
            expect(this.gameSpy.on.calls.count()).toBe(2);
            this.reaction.registerEvents();
            expect(this.gameSpy.on.calls.count()).toBe(2);
        });
    });

    describe('unregisterEvents', function () {
        beforeEach(function () {
            this.properties = {
                when: {
                    onFoo: () => true,
                    onBar: () => true
                },
                handler: () => true
            };
            this.reaction = this.createReaction();
        });

        it('should unregister all previously registered when event handlers', function () {
            this.reaction.registerEvents();
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith(
                'onFoo:forcedreaction',
                jasmine.any(Function)
            );
            expect(this.gameSpy.removeListener).toHaveBeenCalledWith(
                'onBar:forcedreaction',
                jasmine.any(Function)
            );
        });

        it('should not remove listeners when they have not been registered', function () {
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener).not.toHaveBeenCalled();
        });

        it('should not unregister events already unregistered', function () {
            this.reaction.registerEvents();
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener.calls.count()).toBe(2);
            this.reaction.unregisterEvents();
            expect(this.gameSpy.removeListener.calls.count()).toBe(2);
        });
    });
});
