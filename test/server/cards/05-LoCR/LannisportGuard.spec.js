describe('Lannisport Guard', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { hand: ['Lannisport Guard'], gold: 2 } });
        this.opponentHand = this.player2Object.hand.length;
        this.player1.clickCard(this.lannisportGuard);
        this.player1.triggerAbility(this.lannisportGuard);
    });

    it('has each player draw 1 card after you marshal it', function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player2Object.hand).toHaveLength(this.opponentHand + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
