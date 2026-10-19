import AmbushCardAction from '../../../server/game/PlayActions/AmbushCardAction.js';

describe('AmbushCardAction', function () {
    beforeEach(function () {
        this.gameSpy = { addMessage: vi.fn(), on: vi.fn(), removeListener: vi.fn() };
        this.playerSpy = {
            canPutIntoPlay: vi.fn(),
            isCardInPlayableLocation: vi.fn(),
            putIntoPlay: vi.fn()
        };
        this.cardSpy = { getType: vi.fn(), isAmbush: vi.fn() };
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.action = new AmbushCardAction();
    });

    describe('meetsRequirements()', function () {
        beforeEach(function () {
            this.gameSpy.currentPhase = 'challenge';
            this.playerSpy.isCardInPlayableLocation.mockReturnValue(true);
            this.playerSpy.canPutIntoPlay.mockReturnValue(true);
            this.cardSpy.getType.mockReturnValue('character');
            this.cardSpy.isAmbush.mockReturnValue(true);
        });

        describe('when all conditions are met', function () {
            it('should return true', function () {
                expect(this.action.meetsRequirements(this.context)).toBe(true);
            });
        });

        describe('when the phase is not challenge', function () {
            beforeEach(function () {
                this.gameSpy.currentPhase = 'marshal';
            });

            it('should return false', function () {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not in a playable location', function () {
            beforeEach(function () {
                this.playerSpy.isCardInPlayableLocation.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is an event', function () {
            beforeEach(function () {
                this.cardSpy.getType.mockReturnValue('event');
            });

            it('should return false', function () {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not an ambushable card', function () {
            beforeEach(function () {
                this.cardSpy.isAmbush.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card cannot be put into play', function () {
            beforeEach(function () {
                this.playerSpy.canPutIntoPlay.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });
    });

    describe('executeHandler()', function () {
        beforeEach(function () {
            this.action.executeHandler(this.context);
        });

        it('should put the card into play', function () {
            expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(this.cardSpy, 'ambush');
        });
    });
});
