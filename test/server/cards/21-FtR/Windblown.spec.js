describe('Windblown (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Windblown (FtR)', { card: 'Unsullied', kneeling: true }]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.windblown);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.windblown);
        this.player1.clickCard(this.unsullied);
    });

    it('returns itself to shadows to stand an Army or Mercenary character after you win a challenge it is participating in', function () {
        expect(this.windblown.location).toBe('shadows');
        expect(this.unsullied.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
