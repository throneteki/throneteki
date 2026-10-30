describe('Gunthor Son of Gurn', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Gunthor Son of Gurn'] },
            player2: { hand: ['Hot Pie (FFH)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.gunthorSonOfGurn);
        this.player1.triggerAbility(this.gunthorSonOfGurn);
        this.player2.clickCard(this.hotPie);
    });

    it('makes the losing opponent choose and discard a card from their hand after you win a challenge he attacks in', function () {
        expect(this.hotPie.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
