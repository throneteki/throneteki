import GameAction from '../../../server/game/GameActions/GameAction.js';

describe('GameAction', function () {
    beforeEach(function () {
        this.action = new GameAction('actionName');
    });

    describe('allow()', function () {
        beforeEach(function () {
            this.cardSpy = { allowGameAction: vi.fn() };
            this.cardSpy.allowGameAction.mockReturnValue(true);
            this.context = { context: 1 };
            this.props = { card: this.cardSpy, context: this.context };

            // Inheritors should override canChangeGameState, so explicitly spy
            // on it in these tests to simulate that.
            vi.spyOn(this.action, 'canChangeGameState').mockReturnValue(true);
        });

        describe('when game state can be changed and target is not immune', function () {
            it('should check the game state', function () {
                this.action.allow(this.props);

                expect(this.action.canChangeGameState).toHaveBeenCalledWith(this.props);
            });

            it('should check the card for immunity', function () {
                this.action.allow(this.props);

                expect(this.cardSpy.allowGameAction).toHaveBeenCalledWith(
                    'actionName',
                    this.context
                );
            });

            it('should return true', function () {
                expect(this.action.allow(this.props)).toBe(true);
            });
        });

        describe('when game state cannot be changed', function () {
            beforeEach(function () {
                this.action.canChangeGameState.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.action.allow(this.props)).toBe(false);
            });
        });

        describe('when the card is immune', function () {
            beforeEach(function () {
                this.cardSpy.allowGameAction.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.action.allow(this.props)).toBe(false);
            });

            it('should ignore immunity if the force flag is passed', function () {
                let props = Object.assign({ force: true }, this.props);
                expect(this.action.allow(props)).toBe(true);
            });
        });
    });

    describe('createEvent()', function () {
        it('should force inheritors to override', function () {
            expect(() => this.action.createEvent({})).toThrow();
        });
    });
});
