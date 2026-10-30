describe('Grenn', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Grenn', 'Old Forest Hunter'] },
            player2: { power: 2 }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.grenn);
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.grenn);
        this.player1.clickCard(this.oldForestHunter);
    });

    it("moves power from the losing opponent's faction card to another attacking thenightswatch character after you win a challenge he attacks in", function () {
        expect(this.oldForestHunter.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
