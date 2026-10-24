describe('Maester Myles', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Maester Myles'],
                usedPlots: ['A Noble Cause', 'Sneak Attack']
            },
            player2: { inPlay: ['Hedge Knight', 'Robb Stark (Core)'] }
        });
        this.player1.clickCard(this.maesterMyles);
    });

    it('removes a challenge icon of your choice from a character with printed cost up to your used plots', function () {
        expect(this.player1).not.toAllowSelect(this.robbStark);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Military');

        expect(this.hedgeKnight.hasIcon('military')).toBe(false);
        expect(this.maesterMyles.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
