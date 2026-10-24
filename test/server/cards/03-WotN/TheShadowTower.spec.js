describe('The Shadow Tower (WotN)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['The Shadow Tower (WotN)', 'Ser Jaime Lannister (Core)']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.theShadowTower);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels to stop a character controlled by the losing opponent attacking this phase after you win a challenge as the defender', function () {
        expect(this.theShadowTower.kneeled).toBe(true);
        expect(this.burnedMen.allowGameAction('declareAsAttacker')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
