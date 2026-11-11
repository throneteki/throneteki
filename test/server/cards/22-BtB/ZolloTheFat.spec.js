describe('Zollo the Fat', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Zollo the Fat'], gold: 0 },
            player2: { inPlay: ['The Goldroad'], gold: 2 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.theGoldroad);
        this.player1.triggerAbility(this.zolloTheFat);
    });

    it("sacrifices itself to move all gold from an opponent's gold pool to yours after they gain gold outside the marshaling phase", function () {
        expect(this.zolloTheFat.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(3);
        expect(this.player2Object.gold).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });
});
