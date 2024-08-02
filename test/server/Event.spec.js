import Event from '../../server/game/event.js';

describe('Event', function () {
    beforeEach(function () {
        this.childEventSpy = jasmine.createSpyObj('childEvent', [
            'cancel',
            'emitTo',
            'handler',
            'getConcurrentEvents',
            'createSnapshot'
        ]);
    });

    describe('constructor', function () {
        beforeEach(function () {
            this.event = new Event('onEvent', { foo: 'bar' });
        });

        it('should merge parameters onto the event', function () {
            expect(this.event.foo).toBe('bar');
        });

        it('should throw an exception if a reserved property name is used in the parameters', function () {
            expect(function () {
                new Event('onEvent', { parent: 'foo' });
            }).toThrowError(/parent/);
        });
    });

    describe('emitTo', function () {
        beforeEach(function () {
            this.event = new Event('onEvent', { foo: 'bar' });
            this.emitterSpy = jasmine.createSpyObj('emitter', ['emit']);
        });

        describe('when called without a suffix', function () {
            beforeEach(function () {
                this.event.emitTo(this.emitterSpy);
            });

            it('should send the event to the emitter', function () {
                expect(this.emitterSpy.emit).toHaveBeenCalledWith('onEvent', this.event);
            });
        });

        describe('when called with a suffix', function () {
            beforeEach(function () {
                this.event.emitTo(this.emitterSpy, 'suffix');
            });

            it('should send the event to the emitter with the suffix concated to the name', function () {
                expect(this.emitterSpy.emit).toHaveBeenCalledWith('onEvent:suffix', this.event);
            });
        });

        describe('when the event has children', function () {
            beforeEach(function () {
                this.event.addChildEvent(this.childEventSpy);
                this.event.emitTo(this.emitterSpy, 'suffix');
            });

            it('should call emitTo on the children', function () {
                expect(this.childEventSpy.emitTo).toHaveBeenCalledWith(this.emitterSpy, 'suffix');
            });
        });
    });

    describe('executeHandler', function () {
        beforeEach(function () {
            this.handlerSpy = jasmine.createSpy('handler');
            this.event = new Event('onEvent', { foo: 'bar' }, this.handlerSpy);
        });

        it('should call the handler with appropriate parameters', function () {
            this.event.executeHandler();
            expect(this.handlerSpy).toHaveBeenCalledWith(this.event);
        });

        describe('when the handler has been replaced', function () {
            beforeEach(function () {
                this.replacementHandlerSpy = jasmine.createSpy('replacementHandler');
                this.event.replaceHandler(this.replacementHandlerSpy);
                this.event.executeHandler();
            });

            it('should call the replacement handler', function () {
                expect(this.replacementHandlerSpy).toHaveBeenCalledWith(this.event);
            });

            it('should not call the original handler', function () {
                expect(this.handlerSpy).not.toHaveBeenCalled();
            });
        });

        describe('when the event has children', function () {
            beforeEach(function () {
                this.event.addChildEvent(this.childEventSpy);
                this.childEventSpy.getConcurrentEvents.and.returnValue([this.childEventSpy]);
                this.event.executeHandler();
            });

            it('should call handler on the children', function () {
                expect(this.childEventSpy.handler).toHaveBeenCalled();
            });
        });

        describe('when the event has children within children', function () {
            beforeEach(function () {
                this.childEvent = new Event('childEvent', { foo: 'bar' });
                spyOn(this.childEvent, 'handler');
                this.childEventSpy.getConcurrentEvents.and.returnValue([this.childEventSpy]);
                this.childEvent.addChildEvent(this.childEventSpy);
                this.event.addChildEvent(this.childEvent);

                this.event.executeHandler();
            });

            it('should call handler on all historical children', function () {
                expect(this.childEvent.handler).toHaveBeenCalled();
                expect(this.childEventSpy.handler).toHaveBeenCalled();
            });
        });
    });

    describe('cancel', function () {
        beforeEach(function () {
            this.event = new Event('onEvent', { foo: 'bar' });
        });

        it('should mark the event as cancelled', function () {
            this.event.cancel();
            expect(this.event.cancelled).toBe(true);
        });

        describe('when the event has children', function () {
            beforeEach(function () {
                this.event.addChildEvent(this.childEventSpy);
                this.event.cancel();
            });

            it('should call cancel on the children', function () {
                expect(this.childEventSpy.cancel).toHaveBeenCalled();
            });
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
            this.event = new Event('onEvent', { foo: 'bar' });
            this.event.addChildEvent(this.childEventSpy);
        });

        it('should add the child to the list of children', function () {
            expect(this.event.childEvents).toContain(this.childEventSpy);
        });

        it('should set the parent for the child', function () {
            expect(this.childEventSpy.parent).toBe(this.event);
        });
    });

    describe('onChildCancelled', function () {
        beforeEach(function () {
            this.event = new Event('onEvent', { foo: 'bar' });
            this.event.addChildEvent(this.childEventSpy);
            this.event.onChildCancelled(this.childEventSpy);
        });

        it('should remove the specified event from the list', function () {
            expect(this.event.childEvents).not.toContain(this.childEventSpy);
        });
    });

    describe('getConcurrentEvents', function () {
        beforeEach(function () {
            this.event = new Event('onEvent', { foo: 'bar' });
        });

        it('should return an array with the event', function () {
            expect(this.event.getConcurrentEvents()).toEqual([this.event]);
        });

        describe('when the event has children', function () {
            beforeEach(function () {
                this.childEventSpy.getConcurrentEvents.and.returnValue(['child-events']);
                this.event.addChildEvent(this.childEventSpy);
            });

            it('should return an array with itself and the concurrent events for its children', function () {
                expect(this.event.getConcurrentEvents()).toEqual([this.event, 'child-events']);
            });
        });
    });

    describe('resolved', function () {
        beforeEach(function () {
            this.event = new Event('onEvent', { foo: 'bar' });
        });

        describe('when the event is cancelled', function () {
            beforeEach(function () {
                this.event.cancel();
            });

            it('returns false', function () {
                expect(this.event.resolved).toBe(false);
            });
        });

        describe('when the custom isFullyResolved function returns false', function () {
            beforeEach(function () {
                const isFullyResolved = jasmine.createSpy('isFullyResolved');
                isFullyResolved.and.returnValue(false);
                this.event = new Event('onEvent', { isFullyResolved });
            });

            it('returns false', function () {
                expect(this.event.resolved).toBe(false);
            });
        });

        describe('when the custom isFullyResolved function returns true', function () {
            beforeEach(function () {
                const isFullyResolved = jasmine.createSpy('isFullyResolved');
                isFullyResolved.and.returnValue(true);
                this.event = new Event('onEvent', { isFullyResolved });
            });

            it('returns true', function () {
                expect(this.event.resolved).toBe(true);
            });
        });

        describe('when there is no custom isFullyResolved param', function () {
            it('returns true', function () {
                this.event = new Event('onEvent', {});
                expect(this.event.resolved).toBe(true);
            });
        });
    });
});
