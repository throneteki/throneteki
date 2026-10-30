describe('Heartsbane', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Margaery Tyrell (Core)', attachments: ['Heartsbane'] }] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.margaeryTyrell);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.heartsbane);
    });

    it('kneels to give the attached character +3 STR while it is participating', function () {
        expect(this.heartsbane.kneeled).toBe(true);
        expect(this.margaeryTyrell.getStrength()).toBe(6);
        expect(this.player2).isReadyToTakeAction();
    });
});
