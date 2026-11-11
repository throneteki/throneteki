describe("The Kraken's Grasp", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                hand: ["The Kraken's Grasp"],
                inPlay: ['Tumblestone Knight']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.theKrakensGrasp);
        this.player1.clickCard(this.burnedMen);
    });

    it('stops a defending character with STR 5 or lower contributing STR while you are the first player', function () {
        expect(this.game.currentChallenge.defenderStrength).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
