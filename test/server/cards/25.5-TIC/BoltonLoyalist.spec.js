describe('Bolton Loyalist', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Bolton Loyalist', 'Hedge Knight'] },
            player2: { inPlay: ['Courtesan of the Rose'] }
        });
        this.unopposedChallenge(this.player2, 'Intrigue', this.courtesanOfTheRose);
    });

    it('gives control of itself to the winning opponent after you lose an intrigue challenge', function () {
        this.player1.clickPrompt('Give Control');
        expect(this.boltonLoyalist).toBeControlledBy(this.player2);
    });

    it('unless you sacrifice another character', function () {
        this.player1.clickPrompt('Sacrifice Character');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.boltonLoyalist).toBeControlledBy(this.player1);
    });
});
