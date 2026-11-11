describe('Reinstatement', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Reinstatement'], discard: ['Grand Maester Pycelle (Core)'] }
        });
        this.player1.togglePromptedActionWindow('standing', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.reinstatement);
    });

    it('kneels your faction card to put a Small Council character into play from your discard pile', function () {
        this.player1.clickCard(this.grandMaesterPycelle);

        expect(this.grandMaesterPycelle.location).toBe('play area');
        expect(this.player1Object.faction.kneeled).toBe(true);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
    });
});
