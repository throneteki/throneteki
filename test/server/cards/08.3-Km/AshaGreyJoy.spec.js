describe('Asha Greyjoy (Km)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Asha Greyjoy (Km)'],
                drawDeck: ['Tumblestone Knight']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.ashaGreyjoy);
        this.player1.triggerAbility(this.ashaGreyjoy);
    });

    it("searches the top X cards of your deck after she pillages, where X is the size of the losing opponent's discard pile", function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
