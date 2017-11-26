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
});
