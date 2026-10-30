describe('Sigorn', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Sigorn', { card: 'Alys Karstark', kneeling: true }] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.sigorn);
        this.player1.triggerAbility(this.sigorn);
    });

    it('stands another Wildling you control after he wins a military challenge attacking, then stands himself if it was Alys Karstark', function () {
        this.player1.clickCard(this.alysKarstark);

        expect(this.alysKarstark.kneeled).toBe(false);
        expect(this.sigorn.kneeled).toBe(false);

        this.player1.clickPrompt('Pass');
        expect(this.player1).isReadyToTakeAction();
    });
});
