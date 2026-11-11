describe('The Throne of Dorne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Throne of Dorne', 'Elia Sand (JS)'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.theThroneOfDorne);
    });

    it('kneels to place a martell card you control in shadows after you lose dominance', function () {
        this.player1.clickCard(this.eliaSand);

        expect(this.eliaSand.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
