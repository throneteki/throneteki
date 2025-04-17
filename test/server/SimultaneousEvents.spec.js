import SimultaneousEvents from '../../server/game/SimultaneousEvents.js';
import Event from '../../server/game/event.js';

describe('SimultaneousEvents', function () {
    beforeEach(function () {
        this.childEvent1 = new Event('event1');
        this.childEvent2 = new Event('event2');
        this.childEvent3 = new Event('event3');

        this.event = new SimultaneousEvents();
        this.event.addChildEvent(this.childEvent1);
        this.event.addChildEvent(this.childEvent2);
        this.event.addChildEvent(this.childEvent3);

        // Explicitly cancel one of the events to ensure it is excluded from
        // operations
        this.childEvent2.cancel();
    });

    describe('emitTo', function () {
        beforeEach(function () {
            this.emitter = jasmine.createSpyObj('emitter', ['emit']);
            this.event.emitTo(this.emitter, 'suffix');
        });

        it('should call emitTo on all non-cancelled children', function () {
            expect(this.emitter.emit).toHaveBeenCalledWith('event1:suffix', jasmine.any(Object));
            expect(this.emitter.emit).not.toHaveBeenCalledWith(
                'event2:suffix',
                jasmine.any(Object)
            );
            expect(this.emitter.emit).toHaveBeenCalledWith('event3:suffix', jasmine.any(Object));
        });
    });

    describe('executeHandler', function () {
        beforeEach(function () {
            spyOn(this.childEvent1, 'handler');
            spyOn(this.childEvent2, 'handler');
            spyOn(this.childEvent3, 'handler');
            this.event.executeHandler();
        });

        it('should call handler on all children', function () {
            expect(this.childEvent1.handler).toHaveBeenCalled();
            expect(this.childEvent2.handler).not.toHaveBeenCalled();
            expect(this.childEvent3.handler).toHaveBeenCalled();
        });
    });

    describe('cancel', function () {
        beforeEach(function () {
            this.event.cancel();
        });

        it('should mark the event as cancelled', function () {
            expect(this.event.cancelled).toBe(true);
        });

        it('should mark the child events as cancelled', function () {
            expect(this.childEvent1.cancelled).toBe(true);
            expect(this.childEvent2.cancelled).toBe(true);
            expect(this.childEvent3.cancelled).toBe(true);
        });

        describe('when the event has a parent', function () {
            beforeEach(function () {
                this.parentEventSpy = jasmine.createSpyObj('parentEvent', ['onChildCancelled']);
                this.event.parent = this.parentEventSpy;
                this.event.cancel();
            });

            it('should notify the parent', function () {
                expect(this.parentEventSpy.onChildCancelled).toHaveBeenCalledWith(this.event);
            });
        });
    });

    describe('addChildEvent', function () {
        beforeEach(function () {
            this.childEvent1.params = { prop1: 'foo', prop2: 'bar' };
            this.event = new SimultaneousEvents();
            this.event.addChildEvent(this.childEvent1);
        });

        it('should add the child to the list of children', function () {
            expect(this.event.childEvents).toContain(this.childEvent1);
        });

        it('should not set the parent for the child', function () {
            expect(this.childEvent1.parent).toBeFalsy();
        });

        it('should not extend any properties of the child onto the simultaneous event', function () {
            expect(this.event).not.toEqual(jasmine.objectContaining({ prop1: 'foo' }));
            expect(this.event).not.toEqual(jasmine.objectContaining({ prop2: 'bar' }));
        });
    });

    describe('getConcurrentEvents', function () {
        it('should return an array with the concurrent events of the children', function () {
            expect(this.event.getConcurrentEvents()).toEqual([this.childEvent1, this.childEvent3]);
        });
    });

    describe('resolved', function () {
        beforeEach(function () {
            this.childEvent1 = new Event('event1');
            this.childEvent2 = new Event('event2');
            this.childEvent3 = new Event('event3');

            this.event = new SimultaneousEvents();
            this.event.addChildEvent(this.childEvent1);
            this.event.addChildEvent(this.childEvent2);
            this.event.addChildEvent(this.childEvent3);
        });

        describe('when all child events are resolved', function () {
            it('returns true', function () {
                expect(this.event.resolved).toBe(true);
            });
        });

        describe('when any child event is not resolved', function () {
            beforeEach(function () {
                this.childEvent2.cancel();
            });

            it('returns false', function () {
                expect(this.event.resolved).toBe(false);
            });
        });
    });
});
