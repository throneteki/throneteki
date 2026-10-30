describe('Bribery (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Bribery (R)'], gold: 5 },
            player2: { inPlay: ['Jalabhar Xho'] }
        });
        this.player1.clickCard(this.bribery);
        this.player1.selectValue('2');
        this.player1.clickCard(this.jalabharXho);
    });

    it('kneels a character with printed cost X or lower, then may take control of it if it is an Ally or Mercenary without attachments', function () {
        this.player1.clickPrompt('Yes');

        expect(this.jalabharXho.kneeled).toBe(true);
        expect(this.jalabharXho.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
