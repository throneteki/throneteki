describe('Painted Dogs', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [
                    'Painted Dogs',
                    'Tumblestone Knight',
                    { card: 'Burned Men', kneeling: true }
                ]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.paintedDogs);
        this.player1.clickCard(this.burnedMen);
    });

    it('returns itself to your hand to stand a Clansman character or Tyrion Lannister', function () {
        expect(this.paintedDogs.location).toBe('hand');
        expect(this.burnedMen.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
