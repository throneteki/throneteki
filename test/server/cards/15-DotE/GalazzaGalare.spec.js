describe('Galazza Galare', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['Galazza Galare'],
                drawDeck: ['Targaryen Loyalist', 'Viserion (Core)', 'Merchant Prince']
            }
        });

        this.player1.clickCard(this.galazzaGalare);
        this.player1.triggerAbility(this.galazzaGalare);
    });

    it('searches the top 10 cards for up to 3 [targaryen] characters with printed cost 2 or lower', function () {
        expect(this.player1).not.toBeAbleToSelect(this.merchantPrince);

        this.player1.clickCard(this.targaryenLoyalist);
        this.player1.clickCard(this.viserion);
        this.player1.clickPrompt('Done');

        expect(this.targaryenLoyalist.location).toBe('hand');
        expect(this.viserion.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
