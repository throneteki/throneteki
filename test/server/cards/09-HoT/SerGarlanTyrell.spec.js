describe('Ser Garlan Tyrell (HoT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Garlan Tyrell (HoT)'], hand: ['Hot Pie (FFH)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serGarlanTyrell);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.serGarlanTyrell);
        this.player1.clickCard(this.hotPie);
    });

    it('discards a card from your hand to raise your claim by 1 while a Knight you control attacks alone', function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player1Object.activePlot.getClaim()).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
