describe('Unexpected Guile (R)', function () {
    describe('after you win a challenge the attached character participates in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'Catspaw', attachments: ['Unexpected Guile (R)'] }] }
            });
            expect(this.catspaw.getStrength()).toBe(3);
            this.unopposedChallenge(this.player1, 'Intrigue', this.catspaw);
            this.player1.triggerAbility(this.unexpectedGuile);
        });

        it('gives it +2 STR, and returns it to shadows', function () {
            expect(this.catspaw.location).toBe('shadows');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
