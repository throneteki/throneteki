describe('White Tree', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['White Tree'] } });
        this.startingGold = this.player1Object.gold;
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.whiteTree);
    });

    it("kneels to move 1 gold from an opponent's gold pool to yours after they collect income", function () {
        expect(this.whiteTree.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player2Object.gold).toBe(4);
        expect(this.player2).isReadyToTakeAction();
    });
});
