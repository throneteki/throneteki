import RedirectChallenge from '../../../server/game/GameActions/RedirectChallenge.js';
import Challenge from '../../../server/game/challenge.js';

describe('RedirectChallenge', function () {
    beforeEach(function () {
        this.attacker = {};
        this.original = {};
        this.alternative = {};
        this.game = {
            getOpponents: () => [this.original, this.alternative],
            currentChallengeStep: { redirectChallengeTo: vi.fn() }
        };
        this.challenge = {
            game: this.game,
            initiatingPlayer: this.attacker,
            defendingPlayer: this.original,
            initiatedAgainstPlayer: this.original
        };
        this.game.currentChallenge = this.challenge;
    });

    it('allows another opponent but rejects the attacker, original defender and outsiders', function () {
        expect(
            RedirectChallenge.allow({ challenge: this.challenge, player: this.alternative })
        ).toBe(true);
        for (const player of [this.attacker, this.original, {}]) {
            expect(RedirectChallenge.allow({ challenge: this.challenge, player })).toBe(false);
        }
    });

    it('rejects a cancelled or completed challenge', function () {
        this.challenge.cancelled = true;
        expect(
            RedirectChallenge.allow({ challenge: this.challenge, player: this.alternative })
        ).toBe(false);
        this.challenge.cancelled = false;
        this.game.currentChallenge = null;
        expect(
            RedirectChallenge.allow({ challenge: this.challenge, player: this.alternative })
        ).toBe(false);
        expect(RedirectChallenge.allow({ challenge: null, player: this.alternative })).toBe(false);
    });

    it('raises a redirection event and resolves through the challenge flow', function () {
        const event = RedirectChallenge.createEvent({
            challenge: this.challenge,
            player: this.alternative
        });
        expect(event.name).toBe('onChallengeRedirected');
        expect(event.previousDefender).toBe(this.original);
        event.executeHandler();
        expect(this.game.currentChallengeStep.redirectChallengeTo).toHaveBeenCalledWith(
            this.alternative
        );
    });

    it('changes the resolving defender while preserving the original opponent and clearing initiation actions', function () {
        const challenge = Object.assign(Object.create(Challenge.prototype), {
            defendingPlayer: this.original,
            initiatedAgainstPlayer: this.original,
            initiationActions: [{}]
        });
        challenge.redirectChallengeTo(this.alternative);
        expect(challenge.defendingPlayer).toBe(this.alternative);
        expect(challenge.initiatedAgainstPlayer).toBe(this.original);
        expect(challenge.initiationActions).toEqual([]);
    });
});
