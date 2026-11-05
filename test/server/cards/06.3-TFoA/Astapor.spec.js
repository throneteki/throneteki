describe('Astapor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: [{ card: 'Astapor', gold: 2 }, 'Khal Drogo (Core)']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.astapor);
        this.player1.clickCard(this.khalDrogo);
    });

    it('kneels to give a participating character -X STR, where X is the gold on it', function () {
        expect(this.astapor.kneeled).toBe(true);
        expect(this.khalDrogo.getStrength()).toBe(3);
        expect(this.player2).isReadyToTakeAction();
    });
});
