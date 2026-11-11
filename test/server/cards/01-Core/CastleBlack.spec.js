describe('Castle Black (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['Castle Black (Core)', 'Ghost (Core)'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.ghost);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.castleBlack);
        this.player1.clickCard(this.ghost);
    });

    it('kneels to stand a defending thenightswatch character and give it +2 STR until the end of the challenge', function () {
        expect(this.castleBlack.kneeled).toBe(true);
        expect(this.ghost.kneeled).toBe(false);
        expect(this.ghost.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
