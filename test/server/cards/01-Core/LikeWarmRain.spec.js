describe('Like Warm Rain', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Like Warm Rain'], inPlay: ['Summer (Core)'], gold: 1 },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Intrigue');
        this.player2.clickCard(this.littlefinger);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.likeWarmRain);
        this.player1.clickCard(this.summer);
        this.player1.clickCard(this.littlefinger);
    });

    it('kneels a Direwolf to kill an attacking character after you lose an intrigue challenge as the defender', function () {
        expect(this.summer.kneeled).toBe(true);
        expect(this.littlefinger.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
