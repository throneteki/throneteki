describe('Ghaston Grey', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Ghaston Grey'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.ghastonGrey);
        this.player1.clickCard(this.burnedMen);
    });

    it("kneels and sacrifices itself to return an attacking character to its owner's hand after you lose a challenge as the defender", function () {
        expect(this.ghastonGrey.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
