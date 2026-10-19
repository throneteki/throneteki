import ThenAbilityAction from '../../../server/game/GameActions/ThenAbilityAction.js';
import ThenClauseAbility from '../../../server/game/ThenClauseAbility.js';

describe('ThenAbilityAction', function () {
    beforeEach(function () {
        this.eventSpy = { thenExecute: vi.fn() };
        this.eventSpy.resolved = true;
        this.internalActionSpy = { allow: vi.fn(), createEvent: vi.fn() };
        this.internalActionSpy.createEvent.mockReturnValue(this.eventSpy);
        this.gameSpy = {
            popAbilityContext: vi.fn(),
            pushAbilityContext: vi.fn(),
            resolveAbility: vi.fn()
        };
        this.context = { props: 'external', game: this.gameSpy };
    });

    describe('when passed a properties object', function () {
        beforeEach(function () {
            this.abilityProps = { props: 'internal', handler: () => true };
            this.action = new ThenAbilityAction(this.internalActionSpy, this.abilityProps);
        });

        describe('allow()', function () {
            it('should call allow on the internal action', function () {
                this.action.allow(this.context);

                expect(this.internalActionSpy.allow).toHaveBeenCalledWith(this.context);
            });

            it('should return the value of the internal allow call', function () {
                this.internalActionSpy.allow.mockReturnValue('INTERNAL ALLOW VALUE');

                expect(this.action.allow(this.context)).toBe('INTERNAL ALLOW VALUE');
            });
        });

        describe('createEvent()', function () {
            it('should call createEvent on the internal action', function () {
                this.action.createEvent(this.context);

                expect(this.internalActionSpy.createEvent).toHaveBeenCalledWith(this.context);
            });

            it('should return the value of the internal createEvent call', function () {
                expect(this.action.createEvent(this.context)).toBe(this.eventSpy);
            });

            describe('the thenExecute function', function () {
                beforeEach(function () {
                    this.eventSpy.thenExecute.mockImplementation((thenExecute) => {
                        this.thenExecute = thenExecute;
                    });

                    this.action.createEvent(this.context);
                });

                it('creates and resolves the associated ability', function () {
                    this.thenExecute(this.eventSpy);

                    expect(this.gameSpy.resolveAbility).toHaveBeenCalledWith(
                        expect.any(ThenClauseAbility),
                        expect.any(Object)
                    );
                });

                it('does not resolve the ability if the event failed to fully resolve', function () {
                    this.eventSpy.resolved = false;
                    this.thenExecute(this.eventSpy);

                    expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
                });
            });
        });
    });
});
