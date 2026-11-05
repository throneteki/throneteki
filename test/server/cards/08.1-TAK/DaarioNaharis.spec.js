describe('Daario Naharis', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Daario Naharis'] },
            player2: { inPlay: [{ card: 'Jalabhar Xho', kneeling: true }] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.daarioNaharis);
        this.player1.triggerAbility(this.daarioNaharis);
    });

    it('stands another Ally, Companion or Mercenary and takes control of it until the end of the phase after he wins attacking', function () {
        expect(this.player1).not.toBeAbleToSelect(this.daarioNaharis);

        this.player1.clickCard(this.jalabharXho);

        expect(this.jalabharXho.kneeled).toBe(false);
        expect(this.jalabharXho.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
