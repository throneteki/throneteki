describe('Gulltown Merchant (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'City Blockade (FUtG)',
                inPlay: ['Gulltown Merchant (AHaH)']
            }
        });

        this.player1.clickCard(this.gulltownMerchant);
    });

    it('kneels to gain 1 gold while there is a City plot card revealed', function () {
        expect(this.gulltownMerchant.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
