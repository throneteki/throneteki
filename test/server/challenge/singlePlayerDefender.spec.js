import Challenge from '../../../server/game/challenge.js';

describe('a challenge with no defending player', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge' });
        this.challenge = new Challenge(this.game, {
            attackingPlayer: this.player1Object,
            challengeType: 'intrigue'
        });
    });

    it('is made against a named placeholder player with no cards', function () {
        const defender = this.challenge.defendingPlayer;

        expect(defender.isFake).toBe(true);
        expect(defender.name).toBe('Dummy Player');
        expect(defender.hand).toHaveLength(0);
        expect(this.game.getPlayers()).not.toContain(defender);
    });
});
