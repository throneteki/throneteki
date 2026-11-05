describe('Kayce Merchant', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            firstPlayer: 'player2',
            player1: { inPlay: [{ card: 'Kayce Merchant', gold: 1 }] }
        });
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.kayceMerchant);
    });

    it('discards 1 gold from itself to gain 2 gold after you collect income', function () {
        expect(this.kayceMerchant.gold).toBe(0);
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
