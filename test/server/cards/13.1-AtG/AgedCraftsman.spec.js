describe('Aged Craftsman', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Aged Craftsman'],
                drawDeck: ['Tumblestone Knight', 'Skirling Pass']
            }
        });

        this.player1.clickCard(this.agedCraftsman);
        this.player1.triggerAbility(this.agedCraftsman);
    });

    it('puts a [thenightswatch] location with printed cost 2 or lower from the top 10 cards into play after it enters play', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.skirlingPass);

        expect(this.skirlingPass.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
