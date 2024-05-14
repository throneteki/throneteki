import AbilityAdapter from '../../../server/game/GameActions/AbilityAdapter.js';

describe('AbilityAdapter', function () {
    beforeEach(function () {
        this.internalActionSpy = jasmine.createSpyObj('action', ['allow', 'createEvent']);
        this.context = { props: 'external' };
    });

    describe('when passed a properties object', function () {
        beforeEach(function () {
            this.internalProps = { props: 'internal' };
            this.adapter = new AbilityAdapter(this.internalActionSpy, this.internalProps);
        });

        describe('allow()', function () {
            it('should call allow on the internal action with the stored properties', function () {
                this.adapter.allow(this.context);

                expect(this.internalActionSpy.allow).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        props: 'internal',
                        context: this.context
                    })
                );
            });

            it('should return the value of the internal allow call', function () {
                this.internalActionSpy.allow.and.returnValue('INTERNAL ALLOW VALUE');

                expect(this.adapter.allow(this.context)).toBe('INTERNAL ALLOW VALUE');
            });
        });

        describe('createEvent()', function () {
            it('should call createEvent on the internal action with the stored properties', function () {
                this.adapter.createEvent(this.context);

                expect(this.internalActionSpy.createEvent).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        props: 'internal',
                        context: this.context
                    })
                );
            });

            it('should return the value of the internal createEvent call', function () {
                this.internalActionSpy.createEvent.and.returnValue('INTERNAL CREATE EVENT');

                expect(this.adapter.createEvent(this.context)).toBe('INTERNAL CREATE EVENT');
            });

            it('adds each post-execution handler to the created event', function () {
                const eventSpy = jasmine.createSpyObj('event', ['thenExecute']);
                this.internalActionSpy.createEvent.and.returnValue(eventSpy);

                this.adapter.thenExecute('my-func1').thenExecute('my-func2');
                this.adapter.createEvent(this.context);

                expect(eventSpy.thenExecute).toHaveBeenCalledWith('my-func1');
                expect(eventSpy.thenExecute).toHaveBeenCalledWith('my-func2');
            });
        });

        describe('thenExecute()', function () {
            it('adds the function handler', function () {
                this.adapter.thenExecute('my-func');

                expect(this.adapter.thenExecuteHandlers).toContain('my-func');
            });

            it('returns the adapter', function () {
                expect(this.adapter.thenExecute('my-func')).toBe(this.adapter);
            });
        });
    });

    describe('when passed a properties factory method', function () {
        beforeEach(function () {
            this.transformedProperties = { props: 'transformed' };
            this.propertyFactory = jasmine.createSpy('propertyFactory');
            this.propertyFactory.and.returnValue(this.transformedProperties);
            this.adapter = new AbilityAdapter(this.internalActionSpy, this.propertyFactory);
        });

        describe('allow()', function () {
            it('should call the property factory using the context object', function () {
                this.adapter.allow(this.context);

                expect(this.propertyFactory).toHaveBeenCalledWith(this.context);
            });

            it('should call allow on the internal action with the transformed', function () {
                this.adapter.allow(this.context);

                expect(this.internalActionSpy.allow).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        props: 'transformed',
                        context: this.context
                    })
                );
            });

            it('should return the value of the internal allow call', function () {
                this.internalActionSpy.allow.and.returnValue('INTERNAL ALLOW VALUE');

                expect(this.adapter.allow(this.context)).toBe('INTERNAL ALLOW VALUE');
            });
        });

        describe('createEvent()', function () {
            it('should call the property factory using the context object', function () {
                this.adapter.createEvent(this.context);

                expect(this.propertyFactory).toHaveBeenCalledWith(this.context);
            });

            it('should call createEvent on the internal action with the stored properties', function () {
                this.adapter.createEvent(this.context);

                expect(this.internalActionSpy.createEvent).toHaveBeenCalledWith(
                    jasmine.objectContaining({
                        props: 'transformed',
                        context: this.context
                    })
                );
            });

            it('should return the value of the internal createEvent call', function () {
                this.internalActionSpy.createEvent.and.returnValue('INTERNAL CREATE EVENT');

                expect(this.adapter.createEvent(this.context)).toBe('INTERNAL CREATE EVENT');
            });
        });
    });
});
