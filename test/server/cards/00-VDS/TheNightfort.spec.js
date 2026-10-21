describe('The Nightfort', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['The Nightfort', 'Ghost (Core)'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.ghost);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theNightfort);
        this.player1.clickCard(this.ghost);
    });

    it('kneels to give a defending thenightswatch character +1 STR for each attacking character', function () {
        expect(this.theNightfort.kneeled).toBe(true);
        expect(this.ghost.getStrength()).toBe(4);
        expect(this.player2).isReadyToTakeAction();
    });
});
