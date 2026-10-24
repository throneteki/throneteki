describe("Tobho Mott's Armory", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ["Tobho Mott's Armory", 'Tumblestone Knight'],
                drawDeck: ['Hot Pie (FFH)']
            }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.tobhoMottsArmory);
    });

    it('kneels to draw 1 card after you win dominance', function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
