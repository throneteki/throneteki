describe('Tanda Stokeworth', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { hand: ['Tanda Stokeworth'], gold: 3 } });
        this.opponentGold = this.player2Object.gold;
        this.player1.clickCard(this.tandaStokeworth);
        this.player1.triggerAbility(this.tandaStokeworth);
    });

    it('has each player gain 3 gold after you marshal her', function () {
        expect(this.player1Object.gold).toBe(3);
        expect(this.player2Object.gold).toBe(this.opponentGold + 3);
        expect(this.player1).isReadyToTakeAction();
    });
});
