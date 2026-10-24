describe('Red Rain', function () {
    describe('attached to The Drumm', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'The Drumm', attachments: ['Red Rain'] }] }
            });
            expect(this.theDrumm.hasKeyword('Stealth')).toBe(true);
            this.unopposedChallenge(this.player1, 'Power', this.theDrumm);
            this.player1.triggerAbility(this.redRain);
        });

        it('gives him stealth, and has him gain 2 power after he wins an unopposed challenge as an attacker', function () {
            expect(this.theDrumm.power).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
