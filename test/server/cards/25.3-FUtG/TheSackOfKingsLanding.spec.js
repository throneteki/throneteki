describe("The Sack of King's Landing (FUtG)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: "The Sack of King's Landing (FUtG)",
                inPlay: ['Cersei Lannister (Core)']
            },
            player2: {
                inPlay: ['Desperate Deserter', 'Tumblestone Knight'],
                drawDeck: ['Sweet Cersei']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
        this.player1.triggerAbility(this.theSackOfKingsLanding);
    });

    it('gives lannister characters pillage during intrigue challenges, and has an opponent kill a character with the same printed cost as a location entering their discard pile', function () {
        expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player2.clickCard(this.desperateDeserter);

        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.desperateDeserter.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
