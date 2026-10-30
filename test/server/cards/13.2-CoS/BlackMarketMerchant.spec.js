describe('Black Market Merchant', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                shadows: ['Black Market Merchant'],
                drawDeck: ['Tumblestone Knight', 'Little Bird (Core)']
            }
        });

        this.player1.clickCard(this.blackMarketMerchant);
        this.player1.triggerAbility(this.blackMarketMerchant);
    });

    it('attaches an attachment with printed cost 3 or lower from the top 10 cards to a character you control after it comes out of shadows', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.blackMarketMerchant);

        expect(this.littleBird.parent).toBe(this.blackMarketMerchant);
        expect(this.player1).isReadyToTakeAction();
    });
});
