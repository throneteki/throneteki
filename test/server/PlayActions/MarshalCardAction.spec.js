import MarshalCardAction from '../../../server/game/PlayActions/MarshalCardAction.js';

describe('MarshalCardAction', function () {
    beforeEach(function () {
        this.gameSpy = {
            addMessage: vi.fn(),
            getActionTimingRequirement: vi.fn(),
            on: vi.fn(),
            raiseEvent: vi.fn(),
            removeListener: vi.fn()
        };
        this.gameSpy.raiseEvent.mockImplementation(function (name, params, handler) {
            handler();
        });
        this.playerSpy = {
            canDuplicate: vi.fn(),
            canPutIntoPlay: vi.fn(),
            isCardInPlayableLocation: vi.fn(),
            putIntoPlay: vi.fn()
        };
        this.cardSpy = { getType: vi.fn() };
        this.cardSpy.controller = this.playerSpy;
        this.cardSpy.owner = this.playerSpy;
        this.context = {
            costs: {},
            game: this.gameSpy,
            player: this.playerSpy,
            source: this.cardSpy
        };
        this.action = new MarshalCardAction();
    });

    describe('meetsRequirements()', function () {
        beforeEach(function () {
            this.gameSpy.currentPhase = 'marshal';
            this.playerSpy.allowMarshal = true;
            this.playerSpy.canDuplicate.mockReturnValue(false);
            this.playerSpy.canPutIntoPlay.mockReturnValue(true);
            this.playerSpy.isCardInPlayableLocation.mockReturnValue(true);
            this.cardSpy.getType.mockReturnValue('character');
        });

        describe('when all conditions are met', function () {
            it('should return true', function () {
                expect(this.action.meetsRequirements(this.context)).toBe(true);
            });
        });

        describe('when the phase not marshal', function () {
            beforeEach(function () {
                this.gameSpy.currentPhase = 'dominance';
            });

            it('should return false', function () {
                expect(this.action.meetsRequirements(this.context)).toBe(false);
            });
        });

        describe('when the card is not in a valid marshal location', function () {
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
            expect(this.playerSpy.putIntoPlay).toHaveBeenCalledWith(this.cardSpy, 'marshal');
        });
    });
});
