describe('Messenger Raven', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Messenger Raven'],
                drawDeck: ['Hot Pie (FFH)']
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.messengerRaven);
    });

    it('returns itself to your hand to draw 1 card during the dominance phase', function () {
        expect(this.messengerRaven.location).toBe('hand');
        expect(this.hotPie.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
