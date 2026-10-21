describe('The Small Council', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'The Small Council',
                inPlay: ['Grand Maester Pycelle (Core)', 'Cersei Lannister (Core)']
            }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.theSmallCouncil);
    });

    it('gives a standing Small Council character 1 power after you win dominance, then draws 1 card if you control a Queen', function () {
        this.player1.clickCard(this.grandMaesterPycelle);

        expect(this.grandMaesterPycelle.power).toBe(1);
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
