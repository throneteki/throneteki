describe('Ser Barristan Selmy (LoCR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'targaryen', inPlay: ['Ser Barristan Selmy (LoCR)'] },
            player2: { hand: ['Hot Pie (FFH)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.serBarristanSelmy);
        this.player1.triggerAbility(this.serBarristanSelmy);
    });

    it('stands after you win a challenge he is participating in while you have fewer cards in hand than the losing opponent', function () {
        expect(this.serBarristanSelmy.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
