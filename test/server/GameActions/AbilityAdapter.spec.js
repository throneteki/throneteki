const AbilityAdapter = require('../../../server/game/GameActions/AbilityAdapter');

describe('AbilityAdapter', function() {
    beforeEach(function() {
        this.internalActionSpy = jasmine.createSpyObj('action', ['allow', 'createEvent']);
        this.context = { props: 'external' };
    });

    describe('when passed a properties object', function() {
        beforeEach(function() {
            this.internalProps = { props: 'internal' };
            this.adapter = new AbilityAdapter(this.internalActionSpy, this.internalProps);
        });

        describe('allow()', function() {
            it('should call allow on the internal action with the stored properties', function() {
                this.adapter.allow(this.context);

                expect(this.internalActionSpy.allow).toHaveBeenCalledWith(jasmine.objectContaining({
                    props: 'internal',
                    context: this.context
                }));
            });

            it('should return the value of the internal allow call', function() {
                this.internalActionSpy.allow.and.returnValue('INTERNAL ALLOW VALUE');

                expect(this.adapter.allow(this.context)).toBe('INTERNAL ALLOW VALUE');
            });
        });

        describe('createEvent()', function() {
            it('should call createEvent on the internal action with the stored properties', function() {
                this.adapter.createEvent(this.context);

                expect(this.internalActionSpy.createEvent).toHaveBeenCalledWith(jasmine.objectContaining({
                    props: 'internal',
                    context: this.context
                }));
            });

            it('should return the value of the internal createEvent call', function() {
                this.internalActionSpy.createEvent.and.returnValue('INTERNAL CREATE EVENT');

                expect(this.adapter.createEvent(this.context)).toBe('INTERNAL CREATE EVENT');
            });
        });
    });

    describe('when passed a properties factory method', function() {
        beforeEach(function() {
            this.transformedProperties = { props: 'transformed' };
            this.propertyFactory = jasmine.createSpy('propertyFactory');
            this.propertyFactory.and.returnValue(this.transformedProperties);
            this.adapter = new AbilityAdapter(this.internalActionSpy, this.propertyFactory);
        });

        describe('allow()', function() {
            it('should call the property factory using the context object', function() {
                this.adapter.allow(this.context);

                expect(this.propertyFactory).toHaveBeenCalledWith(this.context);
            });

            it('should call allow on the internal action with the transformed', function() {
                this.adapter.allow(this.context);

                expect(this.internalActionSpy.allow).toHaveBeenCalledWith(jasmine.objectContaining({
                    props: 'transformed',
                    context: this.context
                }));
            });

            it('should return the value of the internal allow call', function() {
                this.internalActionSpy.allow.and.returnValue('INTERNAL ALLOW VALUE');

                expect(this.adapter.allow(this.context)).toBe('INTERNAL ALLOW VALUE');
            });
        });

        describe('createEvent()', function() {
            it('should call the property factory using the context object', function() {
                this.adapter.createEvent(this.context);

                expect(this.propertyFactory).toHaveBeenCalledWith(this.context);
            });

            it('should call createEvent on the internal action with the stored properties', function() {
                this.adapter.createEvent(this.context);

                expect(this.internalActionSpy.createEvent).toHaveBeenCalledWith(jasmine.objectContaining({
                    props: 'transformed',
                    context: this.context
                }));
            });

            it('should return the value of the internal createEvent call', function() {
                this.internalActionSpy.createEvent.and.returnValue('INTERNAL CREATE EVENT');

                expect(this.adapter.createEvent(this.context)).toBe('INTERNAL CREATE EVENT');
            });
        });
    });
});
