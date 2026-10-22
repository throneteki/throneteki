describe('Jhogo (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Jhogo (DotE)', 'Khal Drogo (Core)'] },
            player2: { power: 1 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.jhogo);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.jhogo);
    });

    it("moves 1 power from the losing opponent's faction card to yours after you win a military challenge with 2 attacking Dothraki", function () {
        expect(this.player2Object.faction.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
