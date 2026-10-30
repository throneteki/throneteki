import EndChallenge from '../../../server/game/GameActions/EndChallenge.js';

describe('EndChallenge', function () {
    beforeEach(function () {
        this.game = {};
        this.challenge = { game: this.game, cancelled: false, cancelChallenge: vi.fn() };
        this.game.currentChallenge = this.challenge;
    });

    describe('allow()', function () {
        it('returns true for the current challenge', function () {
            expect(EndChallenge.allow({ challenge: this.challenge })).toBe(true);
        });

        it('returns false when the challenge has already ended', function () {
            this.challenge.cancelled = true;
            expect(EndChallenge.allow({ challenge: this.challenge })).toBe(false);
        });

        it('returns false when it is no longer the current challenge', function () {
            this.game.currentChallenge = null;
            expect(EndChallenge.allow({ challenge: this.challenge })).toBe(false);
        });

        it('returns false with no challenge', function () {
            expect(EndChallenge.allow({ challenge: null })).toBe(false);
        });
    });

    describe('createEvent()', function () {
        it('creates an onChallengeEnded event that cancels the challenge', function () {
            const event = EndChallenge.createEvent({ challenge: this.challenge });

            expect(event.name).toBe('onChallengeEnded');
            expect(event.challenge).toBe(this.challenge);

            event.executeHandler();
            expect(this.challenge.cancelChallenge).toHaveBeenCalled();
        });
    });
});
