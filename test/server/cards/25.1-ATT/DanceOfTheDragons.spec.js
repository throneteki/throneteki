describe('Dance of the Dragons', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Dance of the Dragons (ATT)',
                inPlay: ['Hedge Knight', 'Drogon (Core)']
            },
            player2: { inPlay: ['Castle Guard'], power: 3 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Dance of the Dragons');
        this.player1.clickCard(this.drogon);
    });

    it("kneels a Dragon to move 2 power from the loser's faction card instead of the normal claim effects", function () {
        expect(this.drogon.kneeled).toBe(true);
        expect(this.player2Object.faction.power).toBe(1);
        expect(this.player1Object.faction.power).toBe(2 + 1);
        expect(this.castleGuard.location).toBe('play area');
    });
});
