describe('Saving the Kingdom', function () {
    it('kneels a character with STR 3 or lower, which cannot stand during the standing phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Saving the Kingdom'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.savingTheKingdom);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.kneeled).toBe(true);
        this.completeChallengesPhase();
        expect(this.hedgeKnight.kneeled).toBe(true);
    });

    it('pays 1 gold to return itself to your hand after you win dominance', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Robb Stark (Core)'], discard: ['Saving the Kingdom'] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Saving the Kingdom');
        expect(this.savingTheKingdom.location).toBe('hand');
    });
});
