import AtomicEvent from '../../server/game/AtomicEvent.js';

describe('AtomicEvent', function () {
    beforeEach(function () {
        this.childEventSpy1 = jasmine.createSpyObj('childEvent1', [
            'cancel',
            'emitTo',
            'handler',
            'getConcurrentEvents',
            'createSnapshot'
        ]);
        this.childEventSpy2 = jasmine.createSpyObj('childEvent2', [
            'cancel',
            'emitTo',
            'handler',
            'getConcurrentEvents',
            'createSnapshot'
        ]);
        this.event = new AtomicEvent();
        this.event.addChildEvent(this.childEventSpy1);
        this.event.addChildEvent(this.childEventSpy2);
    });

    describe('emitTo', function () {
        beforeEach(function () {
            this.emitter = { emitter: 1 };
            this.event.emitTo(this.emitter, 'suffix');
        });

        it('should call emitTo on all children', function () {
            expect(this.childEventSpy1.emitTo).toHaveBeenCalledWith(this.emitter, 'suffix');
            expect(this.childEventSpy2.emitTo).toHaveBeenCalledWith(this.emitter, 'suffix');
        });
    });

    describe('executeHandler', function () {
        beforeEach(function () {
            this.childEventSpy1.getConcurrentEvents.and.returnValue([this.childEventSpy1]);
            this.childEventSpy2.getConcurrentEvents.and.returnValue([this.childEventSpy2]);
            this.event.executeHandler();
        });

        it('should call handler on all children', function () {
            expect(this.childEventSpy1.handler).toHaveBeenCalled();
            expect(this.childEventSpy2.handler).toHaveBeenCalled();
        });
    });

    describe('cancel', function () {
        beforeEach(function () {
            this.event.cancel();
        });

        it('should mark the event as cancelled', function () {
            expect(this.event.cancelled).toBe(true);
        });

        it('should cancel the child events', function () {
            expect(this.childEventSpy1.cancel).toHaveBeenCalled();
            expect(this.childEventSpy2.cancel).toHaveBeenCalled();
        });

        it('should disassociate the child events', function () {
            expect(this.childEventSpy1.parent).toBe(null);
            expect(this.childEventSpy2.parent).toBe(null);
        });

        it('should clear the list of child events', function () {
            expect(this.event.childEvents).toEqual([]);
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
            this.childEventSpy1.params = { prop1: 'foo', prop2: 'bar' };
            this.event = new AtomicEvent();
            this.event.addChildEvent(this.childEventSpy1);
        });

        it('should add the child to the list of children', function () {
            expect(this.event.childEvents).toContain(this.childEventSpy1);
        });

        it('should set the parent for the child', function () {
            expect(this.childEventSpy1.parent).toBe(this.event);
        });

        it('should extend any properties of the child onto the event', function () {
            expect(this.event.prop1).toBe('foo');
            expect(this.event.prop2).toBe('bar');
        });
    });

    describe('onChildCancelled', function () {
        beforeEach(function () {
            this.event.onChildCancelled(this.childEventSpy1);
        });

        it('should cancel all other children', function () {
            expect(this.childEventSpy2.cancel).toHaveBeenCalled();
        });

        it('should remove all child events', function () {
            expect(this.event.childEvents).toEqual([]);
        });
    });

    describe('getConcurrentEvents', function () {
        beforeEach(function () {
            this.childEventSpy1.getConcurrentEvents.and.returnValue(['child1-events']);
            this.childEventSpy2.getConcurrentEvents.and.returnValue(['child2-events']);
        });

        it('should return an array with the concurrent events of the children', function () {
            expect(this.event.getConcurrentEvents()).toEqual(['child1-events', 'child2-events']);
        });
    });

    describe('resolved', function () {
        beforeEach(function () {
            this.childEventSpy1.resolved = true;
            this.childEventSpy2.resolved = true;
        });

        describe('when the event has been cancelled', function () {
            beforeEach(function () {
                this.event.cancel();
            });

            it('returns false', function () {
                expect(this.event.resolved).toBe(false);
            });
        });

        describe('when all child events are resolved', function () {
            it('returns true', function () {
                expect(this.event.resolved).toBe(true);
            });
        });

        describe('when any child event is not resolved', function () {
            beforeEach(function () {
                this.childEventSpy2.resolved = false;
            });

            it('returns false', function () {
                expect(this.event.resolved).toBe(false);
            });
        });
    });
});
