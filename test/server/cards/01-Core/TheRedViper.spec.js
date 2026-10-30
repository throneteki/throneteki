describe('The Red Viper (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Red Viper (Core)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.theRedViper);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('The Red Viper');
    });

    it('gains 1 power for every 5 STR by which you won the challenge', function () {
        expect(this.theRedViper.power).toBe(1);
        this.player2.clickCard(this.hedgeKnight);
        expect(this.player1).isReadyToTakeAction();
    });
});
