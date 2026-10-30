describe('Captain Groleo', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Captain Groleo'], hand: ['Mercenary Contract'] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.mercenaryContract);
        this.player1.clickCard(this.captainGroleo);
        this.player1.triggerAbility(this.captainGroleo);
    });

    it('gains 1 gold after an attachment enters play', function () {
        expect(this.player1Object.gold).toBe(this.startingGold);
        expect(this.player1).isReadyToTakeAction();
    });
});
