const EventWindow = require('../../../server/game/gamesteps/eventwindow.js');

describe('EventWindow', function() {
    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['openAbilityWindow']);
        this.eventSpy = jasmine.createSpyObj('event', ['allowAutomaticSave', 'emitTo', 'executeHandler']);
        this.eventWindow = new EventWindow(this.gameSpy, this.eventSpy);
    });

    describe('continue()', function() {
        describe('during the normal flow', function() {
            beforeEach(function() {
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt/reaction events', function() {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: this.eventSpy });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: this.eventSpy });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: this.eventSpy });
                expect(this.eventSpy.emitTo).toHaveBeenCalledWith(this.gameSpy);
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: this.eventSpy });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'reaction', event: this.eventSpy });
            });

            it('should call the handler', function() {
                expect(this.eventSpy.executeHandler).toHaveBeenCalled();
            });
        });

        describe('when the event is cancelled', function() {
            beforeEach(function() {
                this.eventSpy.cancelled = true;
            });

            it('should not emit the post-cancel interrupt/reaction events', function() {
                this.eventWindow.continue();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: this.eventSpy });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'interrupt', event: this.eventSpy });
                expect(this.eventSpy.emitTo).not.toHaveBeenCalled();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: this.eventSpy });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'reaction', event: this.eventSpy });
            });

            it('should not call the handler', function() {
                this.eventWindow.continue();
                expect(this.eventSpy.executeHandler).not.toHaveBeenCalled();
            });

            describe('and another step has been queued on the event', function() {
                beforeEach(function() {
                    this.anotherStep = jasmine.createSpyObj('step', ['continue']);
                    this.eventWindow.queueStep(this.anotherStep);
                });

                it('should still call the step', function() {
                    this.eventWindow.continue();
                    expect(this.anotherStep.continue).toHaveBeenCalled();
                });
            });
        });

        describe('when an event handler cancels the event', function() {
            beforeEach(function() {
                this.eventSpy.executeHandler.and.callFake(() => {
                    this.eventSpy.cancelled = true;
                });
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt events', function() {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'cancelinterrupt', event: this.eventSpy });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'forcedinterrupt', event: this.eventSpy });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({ abilityType: 'interrupt', event: this.eventSpy });
            });

            it('should not emit the post-cancel  events', function() {
                expect(this.eventSpy.emitTo).not.toHaveBeenCalled();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'forcedreaction', event: this.eventSpy });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({ abilityType: 'reaction', event: this.eventSpy });
            });
        });
    });
});
