describe('Trading With Braavos', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Trading With Braavos',
                inPlay: ['Ser Jaime Lannister (Core)'],
                drawDeck: ['Sweet Cersei', 'Tumblestone Knight']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.serJaimeLannister);
        this.player1.triggerAbility(this.tradingWithBraavos);
    });

    it('kneels your faction card to search the top 10 cards for a non-limited location after claim is applied, placing a Warship in shadows if you choose', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.sweetCersei);
        this.player1.clickPrompt('Put in shadows');

        expect(this.sweetCersei.location).toBe('shadows');
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
