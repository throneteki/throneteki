describe('Theon Greyjoy (JfE)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'plot', player1: { inPlay: ['Theon Greyjoy (JfE)'] } });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('makes a player who collects income kill a character they control, and gives each opponent 2 power when he leaves play', function () {
        this.player1.clickCard(this.theonGreyjoy);

        expect(this.theonGreyjoy.location).toBe('dead pile');
        expect(this.player2Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
