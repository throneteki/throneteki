describe('Compelled by the King', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Hedge Knight', kneeling: true }],
                hand: ['Compelled by the King']
            }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Compelled by the King');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('stands a character, which gains 1 power if you win dominance', function () {
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.hedgeKnight.power).toBe(1);
    });
});
