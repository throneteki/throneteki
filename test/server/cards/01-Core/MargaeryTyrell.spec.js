describe('Margaery Tyrell (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Margaery Tyrell (Core)', 'Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to give a character +3 STR until the end of the phase', function () {
        expect(this.margaeryTyrell.kneeled).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
