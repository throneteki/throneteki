describe('Ser Edmure Tully', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Edmure Tully', 'Khal Drogo (Core)', 'Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.serEdmureTully);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('moves 1 power from a character that gains power to a House Tully character', function () {
        expect(this.khalDrogo.power).toBe(0);
        expect(this.tumblestoneKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
