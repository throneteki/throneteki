const Event = require('../../server/game/event.js');

describe('Event', function() {
    describe('constructor', function() {
        beforeEach(function() {
            this.event = new Event('onEvent', { foo: 'bar' });
        });

        it('should merge parameters onto the event', function() {
            expect(this.event.foo).toBe('bar');
        });
    });

    describe('emitTo', function() {
        beforeEach(function() {
            this.event = new Event('onEvent', { foo: 'bar' });
            this.emitterSpy = jasmine.createSpyObj('emitter', ['emit']);
        });

        describe('when called without a suffix', function() {
            beforeEach(function() {
                this.event.emitTo(this.emitterSpy);
            });

            it('should send the event to the emitter', function() {
                expect(this.emitterSpy.emit).toHaveBeenCalledWith('onEvent', this.event);
            });
        });

        describe('when called with a suffix', function() {
            beforeEach(function() {
                this.event.emitTo(this.emitterSpy, 'suffix');
            });

            it('should send the event to the emitter with the suffix concated to the name', function() {
                expect(this.emitterSpy.emit).toHaveBeenCalledWith('onEvent:suffix', this.event);
            });
        });
    });

    describe('executeHandler', function() {
        beforeEach(function() {
            this.handlerSpy = jasmine.createSpy('handler');
            this.event = new Event('onEvent', { foo: 'bar' }, this.handlerSpy);
        });

        it('should call the handler with appropriate parameters', function() {
            this.event.executeHandler();
            expect(this.handlerSpy).toHaveBeenCalledWith(this.event);
        });

        describe('when the handler has been replaced', function() {
            beforeEach(function() {
                this.replacementHandlerSpy = jasmine.createSpy('replacementHandler');
                this.event.replaceHandler(this.replacementHandlerSpy);
                this.event.executeHandler();
            });

            it('should call the replacement handler', function() {
                expect(this.replacementHandlerSpy).toHaveBeenCalledWith(this.event);
            });

            it('should not call the original handler', function() {
                expect(this.handlerSpy).not.toHaveBeenCalled();
            });
        });
    });
});
