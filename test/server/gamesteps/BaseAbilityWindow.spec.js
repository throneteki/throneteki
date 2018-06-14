const BaseAbilityWindow = require('../../../server/game/gamesteps/BaseAbilityWindow');

describe('BaseAbilityWindow', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['queueStep', 'resolveAbility']);

        this.eventSpy = jasmine.createSpyObj('event', ['clearAttachedEvents', 'emitTo', 'getConcurrentEvents']);
        this.eventSpy.getConcurrentEvents.and.returnValue([this.eventSpy]);

        this.abilitySpy = jasmine.createSpyObj('ability', ['createContext', 'isTriggeredByEvent', 'meetsRequirements']);

        this.window = new BaseAbilityWindow(this.gameSpy, {
            event: this.eventSpy,
            abilityType: 'interrupt'
        });
    });

    describe('gatherChoices()', function() {
        beforeEach(function() {
            this.window.abilityChoices = ['foo'];
        });

        it('should clear the existing choices', function() {
            this.window.gatherChoices();

            expect(this.window.abilityChoices.length).toBe(0);
        });

        it('should emit the associated event to trigger associated abilities', function() {
            this.window.gatherChoices();

            expect(this.eventSpy.emitTo).toHaveBeenCalledWith(this.gameSpy, 'interrupt');
        });
    });

    describe('hasResolvedAbility()', function() {
        describe('when the ability has not been resolved', function() {
            it('should return false', function() {
                expect(this.window.hasResolvedAbility(this.abilitySpy, this.eventSpy)).toBe(false);
            });
        });

        describe('when the ability has already been resolved for the specific event', function() {
            beforeEach(function() {
                this.window.markAbilityAsResolved(this.abilitySpy, this.eventSpy);
            });

            it('should return true', function() {
                expect(this.window.hasResolvedAbility(this.abilitySpy, this.eventSpy)).toBe(true);
            });
        });

        describe('when the ability has already been resolved for a different event', function() {
            beforeEach(function() {
                this.window.markAbilityAsResolved(this.abilitySpy, { event: 2 });
            });

            it('should return true', function() {
                expect(this.window.hasResolvedAbility(this.abilitySpy, this.eventSpy)).toBe(false);
            });
        });
    });

    describe('registerAbility()', function() {
        beforeEach(function() {
            this.player = { player: 1 };
            this.card = { card: 1 };
            this.context = { context: 1, player: this.player };
            this.abilitySpy.card = this.card;
            this.abilitySpy.createContext.and.returnValue(this.context);
            this.abilitySpy.meetsRequirements.and.returnValue(true);
        });

        describe('when the ability can be registerd', function() {
            beforeEach(function() {
                this.window.registerAbility(this.abilitySpy, this.eventSpy);
            });

            it('should create a context', function() {
                expect(this.abilitySpy.createContext).toHaveBeenCalledWith(this.eventSpy);
                expect(this.abilitySpy.createContext).toHaveBeenCalledTimes(1);
            });

            it('should register the ability', function() {
                expect(this.window.abilityChoices).toContain(jasmine.objectContaining({
                    ability: this.abilitySpy,
                    card: this.card,
                    context: this.context,
                    player: this.player
                }));
            });
        });

        describe('when the ability does not meet requirements', function() {
            beforeEach(function() {
                this.abilitySpy.meetsRequirements.and.returnValue(false);

                this.window.registerAbility(this.abilitySpy, this.eventSpy);
            });

            it('should not register choices', function() {
                expect(this.window.abilityChoices.length).toBe(0);
            });
        });

        describe('when the ability has already been resolved', function() {
            beforeEach(function() {
                this.window.markAbilityAsResolved(this.abilitySpy, this.eventSpy);

                this.window.registerAbility(this.abilitySpy, this.eventSpy);
            });

            it('should not register choices', function() {
                expect(this.window.abilityChoices.length).toBe(0);
            });
        });
    });

    describe('resolveAbility()', function() {
        beforeEach(function() {
            this.context = { event: this.eventSpy };
            this.window.resolveAbility(this.abilitySpy, this.context);
        });

        it('should resolve the ability with the game', function() {
            expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(this.abilitySpy, this.context);
        });

        it('should mark the ability as resolved', function() {
            expect(this.window.hasResolvedAbility(this.abilitySpy, this.eventSpy));
        });
    });
});
