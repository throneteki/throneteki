describe('Disputed Claim', function () {
    describe('while you have more power on your faction card than each opponent', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    power: 1,
                    inPlay: [{ card: 'Bastard in Hiding', attachments: ['Disputed Claim'] }]
                }
            });
        });

        it('gives the attached character +2 STR and renown', function () {
            expect(this.bastardInHiding.getStrength()).toBe(4);
            expect(this.bastardInHiding.hasKeyword('Renown')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
