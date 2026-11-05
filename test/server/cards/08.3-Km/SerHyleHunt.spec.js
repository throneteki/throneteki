describe('Ser Hyle Hunt', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Hyle Hunt'], gold: 1 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serHyleHunt);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.serHyleHunt);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('pays 1 gold to stand a participating character with lower STR and remove it from the challenge', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.tumblestoneKnight.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
