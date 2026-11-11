describe('Horn Hill (TBWB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: [{ card: 'Horn Hill (TBWB)', gold: 2 }, 'Margaery Tyrell (Core)']
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hornHill);
    });

    it('kneels to give each participating tyrell character you control +1 STR for each gold on it', function () {
        expect(this.hornHill.kneeled).toBe(true);
        expect(this.margaeryTyrell.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
