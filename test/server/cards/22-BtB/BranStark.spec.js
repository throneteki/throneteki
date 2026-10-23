describe('Bran Stark (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'stark', inPlay: ['Bran Stark (BtB)'] },
            player2: { hand: ['Hedge Knight', 'Winterfell Steward'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.branStark);
        this.player1.triggerAbility('Bran Stark');
    });

    it("looks at the defending player's hand and discards cards up to the claim value instead of the normal claim", function () {
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickPrompt('Done');
        expect(this.winterfellSteward.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
