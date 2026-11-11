describe('Smiler', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Hedge Knight', attachments: ['Smiler'] }] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Smiler');
        this.player1.clickPrompt('Renown');
    });

    it('kneels after the attached character wins an unopposed challenge attacking to give it renown or intimidate', function () {
        expect(this.smiler.kneeled).toBe(true);
        expect(this.hedgeKnight.power).toBe(1);
    });
});
