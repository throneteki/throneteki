describe('Horn Hill Vanguard', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Horn Hill Vanguard', 'Courtesan of the Rose']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hornHillVanguard);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('gets +1 STR for each standing [tyrell] character you control while it attacks', function () {
        expect(this.hornHillVanguard.getStrength()).toBe(5);

        this.declareNoDefenders(this.player2);

        expect(this.player1).isReadyToTakeAction();
    });
});
