describe('Unexpected Guile', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Catspaw', attachments: ['Unexpected Guile (PoS)'] }] }
        });
        expect(this.catspaw.getStrength()).toBe(3);
        expect(this.catspaw.hasKeyword('Insight')).toBe(true);
        this.unopposedChallenge(this.player1, 'Intrigue', this.catspaw);
        this.player1.clickPrompt('Done');
    });

    it('gives the attached character +2 STR and insight, and returns both to shadows when a challenge it participates in ends', function () {
        expect(this.catspaw.location).toBe('shadows');
        expect(this.unexpectedGuile.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
