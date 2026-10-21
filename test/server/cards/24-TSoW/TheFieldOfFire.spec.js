describe('The Field of Fire', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['The Field of Fire'], inPlay: ['Drogon (DotE)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.theFieldOfFire);
    });

    it('gives each non-Dragon character without attachments -1 STR for each Dragon you control with printed cost 7 or higher', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);
        expect(this.drogon.getStrength()).toBe(10);
        expect(this.player1).isReadyToTakeAction();
    });
});
