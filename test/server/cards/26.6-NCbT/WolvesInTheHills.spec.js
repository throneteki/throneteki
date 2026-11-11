describe('Wolves in the Hills', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Grey Wind (Core)'], hand: ['"Wolves in the Hills"'] },
            player2: { inPlay: ['Castle Guard'], hand: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.greyWind);
        this.player1.triggerAbility('"Wolves in the Hills"');
        this.player1.clickCard(this.greyWind);
        this.player1.clickPrompt('Intrigue');
    });

    it('returns an attacking Direwolf to hand to apply claim of another challenge type instead', function () {
        expect(this.greyWind.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('play area');
    });
});
