describe('Pyat Pree', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Pyat Pree'],
                drawDeck: ['Tumblestone Knight', "Drogo's Arakh"]
            }
        });

        this.unopposedChallenge(this.player1, 'Intrigue', this.pyatPree);
        this.player1.triggerAbility(this.pyatPree);
    });

    it('searches the top X cards for a [targaryen] attachment or event after you win a challenge he participates in', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.drogosArakh);

        expect(this.drogosArakh.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
