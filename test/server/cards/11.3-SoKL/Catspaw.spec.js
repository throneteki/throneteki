describe('Catspaw', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Catspaw'], gold: 3 },
            player2: { inPlay: ['Hot Pie (ToJ)'] }
        });
        this.player1.clickCard(this.catspaw);
        this.player1.triggerAbility(this.catspaw);
        this.player1.selectValue('1');
        this.player1.clickCard(this.hotPie);
    });

    it("pays X gold to return another character with printed cost X or lower to its owner's hand after it comes out of shadows", function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
