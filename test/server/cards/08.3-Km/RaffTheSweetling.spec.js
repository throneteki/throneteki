describe('Raff the Sweetling', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', inPlay: ['Raff the Sweetling'] },
            player2: { inPlay: ['Winterfell Steward'], drawDeck: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.raffTheSweetling);
        this.player1.triggerAbility(this.raffTheSweetling);
        this.player1.clickCard(this.winterfellSteward);
    });

    it("returns a character with printed cost 2 or lower to its owner's hand after he discards a character using pillage", function () {
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
