import SimultaneousAction from '../../../server/game/GameActions/SimultaneousAction.js';

describe('SimultaneousAction', function () {
    beforeEach(function () {
        this.actionSpy1 = jasmine.createSpyObj('action', ['allow', 'createEvent']);
        this.actionSpy1.createEvent.and.returnValue({ resolved: true });
        this.actionSpy2 = jasmine.createSpyObj('action', ['allow', 'createEvent']);
        this.actionSpy2.createEvent.and.returnValue({ resolved: true });
        this.context = { props: 'external' };
    });

    describe('when passed an array of actions', function () {
        beforeEach(function () {
            this.action = new SimultaneousAction([this.actionSpy1, this.actionSpy2]);
        });

        describe('allow()', function () {
            it('returns true if at least one action is allowed', function () {
                this.actionSpy1.allow.and.returnValue(false);
                this.actionSpy2.allow.and.returnValue(true);

                expect(this.action.allow(this.context)).toBe(true);
            });

            it('returns false if all actions are not allowed', function () {
                this.actionSpy1.allow.and.returnValue(false);
                this.actionSpy2.allow.and.returnValue(false);

                expect(this.action.allow(this.context)).toBe(false);
            });
        });

        describe('createEvent()', function () {
            beforeEach(function () {
                this.actionSpy1.allow.and.returnValue(false);
                this.actionSpy2.allow.and.returnValue(true);
                this.event = this.action.createEvent(this.context);
            });

            it('does not create events for non-allowed actions', function () {
                expect(this.actionSpy1.createEvent).not.toHaveBeenCalled();
            });

            it('creates events for allowed actions', function () {
                expect(this.actionSpy2.createEvent).toHaveBeenCalledWith(this.context);
            });

            it('creates null events for non-allowed actions', function () {
                expect(this.event.childEvents[0].constructor.name).toBe('NullEvent');
                expect(this.event.resolved).toBe(false);
            });
        });
    });

    describe('when passed a factory method', function () {
        beforeEach(function () {
            this.actionFactorySpy = jasmine.createSpy('factory');
            this.actionFactorySpy.and.returnValue([this.actionSpy1, this.actionSpy2]);
            this.action = new SimultaneousAction(this.actionFactorySpy);
        });

        describe('allow()', function () {
            it('creates the actions using the context', function () {
                this.action.allow(this.context);

                expect(this.actionFactorySpy).toHaveBeenCalledWith(this.context);
            });

            it('returns true if at least one action is allowed', function () {
                this.actionSpy1.allow.and.returnValue(false);
                this.actionSpy2.allow.and.returnValue(true);

                expect(this.action.allow(this.context)).toBe(true);
            });

            it('returns false if all actions are not allowed', function () {
                this.actionSpy1.allow.and.returnValue(false);
                this.actionSpy2.allow.and.returnValue(false);

                expect(this.action.allow(this.context)).toBe(false);
            });
        });

        describe('createEvent()', function () {
            beforeEach(function () {
                this.actionSpy1.allow.and.returnValue(false);
                this.actionSpy2.allow.and.returnValue(true);
                this.event = this.action.createEvent(this.context);
            });

            it('creates the actions using the context', function () {
                this.action.allow(this.context);

                expect(this.actionFactorySpy).toHaveBeenCalledWith(this.context);
            });

            it('does not create events for non-allowed actions', function () {
                expect(this.actionSpy1.createEvent).not.toHaveBeenCalled();
            });

            it('creates events for allowed actions', function () {
                expect(this.actionSpy2.createEvent).toHaveBeenCalledWith(this.context);
            });

            it('creates null events for non-allowed actions', function () {
                expect(this.event.childEvents[0].constructor.name).toBe('NullEvent');
                expect(this.event.resolved).toBe(false);
            });
        });
    });
});
