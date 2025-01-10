import EventWindow from '../../../server/game/gamesteps/eventwindow.js';

describe('EventWindow', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'openAbilityWindow',
            'openInterruptWindowForAttachedEvents',
            'saveWithDupe'
        ]);
        this.eventSpy = jasmine.createSpyObj('event', [
            'allowAutomaticSave',
            'cancel',
            'clearAttachedEvents',
            'emitTo',
            'executeHandler',
            'executePostHandler',
            'getConcurrentEvents'
        ]);
        this.eventSpy.attachedEvents = [];
        this.eventSpy.getConcurrentEvents.and.returnValue([this.eventSpy]);
        this.eventWindow = new EventWindow(this.gameSpy, this.eventSpy);
    });

    describe('continue()', function () {
        describe('during the normal flow', function () {
            beforeEach(function () {
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt/reaction events', function () {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({
                    abilityType: 'cancelinterrupt',
                    event: this.eventSpy
                });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({
                    abilityType: 'forcedinterrupt',
                    event: this.eventSpy
                });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({
                    abilityType: 'interrupt',
                    event: this.eventSpy
                });
                expect(this.eventSpy.emitTo).toHaveBeenCalledWith(this.gameSpy);
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({
                    abilityType: 'forcedreaction',
                    event: this.eventSpy
                });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({
                    abilityType: 'reaction',
                    event: this.eventSpy
                });
            });

            it('should call the handler', function () {
                expect(this.eventSpy.executeHandler).toHaveBeenCalled();
            });
        });

        describe('when a concurrent event can be saved', function () {
            beforeEach(function () {
                this.concurrentEventSpy = jasmine.createSpyObj('concurrentEvent', [
                    'allowAutomaticSave',
                    'cancel',
                    'clearAttachedEvents'
                ]);
                this.concurrentEventSpy.allowAutomaticSave.and.returnValue(true);
                this.concurrentEventSpy.attachedEvents = [];
                this.concurrentEventSpy.card = { card: 1 };
                this.eventSpy.card = { card: 2 };
                this.eventSpy.getConcurrentEvents.and.returnValue([
                    this.eventSpy,
                    this.concurrentEventSpy
                ]);
            });

            it('should not attempt to cancel any non-automatic-save event', function () {
                this.eventWindow.continue();

                expect(this.gameSpy.saveWithDupe).not.toHaveBeenCalledWith(this.eventSpy.card);
                expect(this.eventSpy.cancel).not.toHaveBeenCalled();
            });

            it('should attempt to save the automatic-save event', function () {
                this.eventWindow.continue();

                expect(this.gameSpy.saveWithDupe).toHaveBeenCalledWith(
                    this.concurrentEventSpy.card
                );
            });

            describe('when the card cannot be saved with a dupe', function () {
                beforeEach(function () {
                    this.gameSpy.saveWithDupe.and.returnValue(false);
                    this.eventWindow.continue();
                });

                it('should not cancel the automatic-save event', function () {
                    expect(this.concurrentEventSpy.cancel).not.toHaveBeenCalled();
                });
            });

            describe('when the card can be saved with a dupe', function () {
                beforeEach(function () {
                    this.gameSpy.saveWithDupe.and.returnValue(true);
                    this.eventWindow.continue();
                });

                it('should cancel the automatic-save event', function () {
                    expect(this.concurrentEventSpy.cancel).toHaveBeenCalled();
                });
            });
        });

        describe('when the event is cancelled', function () {
            beforeEach(function () {
                this.eventSpy.cancelled = true;
            });

            it('should not emit the post-cancel interrupt/reaction events', function () {
                this.eventWindow.continue();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({
                    abilityType: 'forcedinterrupt',
                    event: this.eventSpy
                });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({
                    abilityType: 'interrupt',
                    event: this.eventSpy
                });
                expect(this.eventSpy.emitTo).not.toHaveBeenCalled();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({
                    abilityType: 'forcedreaction',
                    event: this.eventSpy
                });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({
                    abilityType: 'reaction',
                    event: this.eventSpy
                });
            });

            it('should not call the handler', function () {
                this.eventWindow.continue();
                expect(this.eventSpy.executeHandler).not.toHaveBeenCalled();
            });

            describe('and another step has been queued on the event', function () {
                beforeEach(function () {
                    this.anotherStep = jasmine.createSpyObj('step', ['continue']);
                    this.eventWindow.queueStep(this.anotherStep);
                });

                it('should still call the step', function () {
                    this.eventWindow.continue();
                    expect(this.anotherStep.continue).toHaveBeenCalled();
                });
            });
        });

        describe('when an event handler cancels the event', function () {
            beforeEach(function () {
                this.eventSpy.executeHandler.and.callFake(() => {
                    this.eventSpy.cancelled = true;
                });
                this.eventWindow.continue();
            });

            it('should emit all of the interrupt events', function () {
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({
                    abilityType: 'cancelinterrupt',
                    event: this.eventSpy
                });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({
                    abilityType: 'forcedinterrupt',
                    event: this.eventSpy
                });
                expect(this.gameSpy.openAbilityWindow).toHaveBeenCalledWith({
                    abilityType: 'interrupt',
                    event: this.eventSpy
                });
            });

            it('should not emit the post-cancel  events', function () {
                expect(this.eventSpy.emitTo).not.toHaveBeenCalled();
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({
                    abilityType: 'forcedreaction',
                    event: this.eventSpy
                });
                expect(this.gameSpy.openAbilityWindow).not.toHaveBeenCalledWith({
                    abilityType: 'reaction',
                    event: this.eventSpy
                });
            });
        });

        describe('when the event has a card', function () {
            beforeEach(function () {
                this.card = { location: 'play area' };
                this.eventSpy.card = this.card;
                // Simulate card being cloned
                this.eventSpy.cardStateWhenEventCreated = { ...this.card };
            });

            describe('and the card does not move prior to execution', function () {
                it('should not cancel the event', function () {
                    this.eventWindow.continue();
                    expect(this.eventSpy.cancel).not.toHaveBeenCalled();
                });
            });

            describe('and the card has moved prior to execution', function () {
                it('should cancel the event', function () {
                    this.card.location = 'hand';
                    this.eventWindow.continue();
                    expect(this.eventSpy.cancel).toHaveBeenCalled();
                });
            });
        });
    });
});
