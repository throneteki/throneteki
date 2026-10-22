describe('The Council Consents', function () {
    describe('after a player wins an intrigue challenge by 5 or more STR', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Ghiscari Elite', { card: 'Varys (Core)', kneeling: true }],
                    hand: ['The Council Consents']
                }
            });
            this.unopposedChallenge(this.player1, 'Intrigue', this.ghiscariElite);
            this.player1.triggerAbility(this.theCouncilConsents);
        });

        it('stands each Small Council character', function () {
            expect(this.varys.kneeled).toBe(false);
        });
    });
});
