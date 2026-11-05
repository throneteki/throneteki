describe('Trystane Martell (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'martell', hand: ['Trystane Martell (BtB)'], gold: 3 },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.player1.clickCard(this.trystaneMartell);
        this.player1.clickPrompt('Marshal');
        this.player1.triggerAbility(this.trystaneMartell);
        this.player1.clickCard(this.hotPie);
    });

    it("returns a character with no challenge icons to its owner's hand after he enters play", function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
