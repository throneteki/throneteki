describe('A Meager Contribution', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { hand: ['A Meager Contribution'] } });
        this.startingGold = this.player1Object.gold;
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.aMeagerContribution);
    });

    it("moves 1 gold from an opponent's gold pool to yours after they collect income", function () {
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player2Object.gold).toBe(4);
        expect(this.player2).isReadyToTakeAction();
    });
});
