describe('Bribery (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Bribery (DotE)'], gold: 5 },
            player2: { inPlay: ['Jalabhar Xho', 'Tumblestone Knight'] }
        });
        this.player1.clickCard(this.bribery);
        this.player1.selectValue('2');
    });

    it('kneels a character with printed cost X or lower, or takes control of it if it is an Ally or Mercenary', function () {
        this.player1.clickCard(this.jalabharXho);
        this.player1.clickPrompt('Take control');

        expect(this.jalabharXho.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
