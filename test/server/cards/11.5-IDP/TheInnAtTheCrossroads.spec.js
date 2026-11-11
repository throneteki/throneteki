describe('The Inn at the Crossroads', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Inn at the Crossroads'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.handSize = this.player1Object.hand.length;
        this.player1.clickCard(this.theInnAtTheCrossroads);
    });

    it('kneels to draw 3 cards and gives control of itself to an opponent', function () {
        expect(this.player1Object.hand.length).toBe(this.handSize + 3);
        expect(this.theInnAtTheCrossroads.kneeled).toBe(true);
        expect(this.theInnAtTheCrossroads).toBeControlledBy(this.player2);
        expect(this.player2).isReadyToTakeAction();
    });
});
