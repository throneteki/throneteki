describe('Dorea Sand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Obara Sand (Core)'], hand: ['Dorea Sand'], gold: 2 },
            player2: { inPlay: ['Hot Pie (FFH)'] }
        });
        this.player1.clickCard(this.doreaSand);
        this.player1.triggerAbility(this.doreaSand);
        this.player1.clickCard(this.hotPie);
    });

    it("returns another character with printed cost up to the number of Sand Snakes you control to its owner's hand after she enters play", function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
