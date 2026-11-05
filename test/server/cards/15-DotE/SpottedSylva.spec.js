describe('Spotted Sylva', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Spotted Sylva'] },
            player2: { inPlay: ['Black Walder'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.spottedSylva);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.blackWalder);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.spottedSylva);
        this.player2.clickCard(this.blackWalder);
    });

    it("has each player return a participating character to its owner's hand after you lose as the attacker", function () {
        expect(this.spottedSylva.location).toBe('hand');
        expect(this.blackWalder.location).toBe('hand');
    });
});
