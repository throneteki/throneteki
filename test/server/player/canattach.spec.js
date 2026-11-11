import Player from '../../../server/game/player.js';

describe('Player', function () {
    beforeEach(function () {
        this.gameSpy = { raiseEvent: vi.fn() };
        this.player = new Player('1', { username: 'Player 1', settings: {} }, true, this.gameSpy);
        this.player.initialise();

        this.cardSpy = { allowAttachment: vi.fn() };
        this.cardSpy.allowAttachment.mockReturnValue(true);
        this.cardSpy.location = 'play area';
        this.attachmentSpy = { canAttach: vi.fn() };
        this.attachmentSpy.canAttach.mockReturnValue(true);
    });

    describe('canAttach()', function () {
        describe('when everything is correct', function () {
            it('should return true', function () {
                expect(this.player.canAttach(this.attachmentSpy, this.cardSpy)).toBe(true);
            });
        });

        describe('when the card is not in play area', function () {
            beforeEach(function () {
                this.cardSpy.location = 'hand';
            });

            it('should return false', function () {
                expect(this.player.canAttach(this.attachmentSpy, this.cardSpy)).toBe(false);
            });
        });

        describe('when the card does not allow the attachment', function () {
            beforeEach(function () {
                this.cardSpy.allowAttachment.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.player.canAttach(this.attachmentSpy, this.cardSpy)).toBe(false);
            });
        });

        describe('when the attachment cannot be attached to the card', function () {
            beforeEach(function () {
                this.attachmentSpy.canAttach.mockReturnValue(false);
            });

            it('should return false', function () {
                expect(this.player.canAttach(this.attachmentSpy, this.cardSpy)).toBe(false);
            });
        });
    });
});
