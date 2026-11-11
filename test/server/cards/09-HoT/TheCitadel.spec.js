describe('The Citadel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Citadel'],
                drawDeck: ['Tumblestone Knight', 'House Maester']
            }
        });

        this.player1.clickCard(this.theCitadel);
    });

    it('kneels to search the top 10 cards of your deck for a Maester character', function () {
        expect(this.theCitadel.kneeled).toBe(true);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.houseMaester);

        expect(this.houseMaester.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
