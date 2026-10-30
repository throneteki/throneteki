describe('Ser Justin Massey', function () {
    describe('while you control a King', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Ser Justin Massey', 'Robert Baratheon (Core)'] }
            });
            expect(this.serJustinMassey.hasKeyword('Renown')).toBe(true);
            this.unopposedChallenge(this.player1, 'Power', this.serJustinMassey);
            this.player1.triggerAbility(this.serJustinMassey);
        });

        it('gains renown, and stands a baratheon character after it gains power', function () {
            expect(this.serJustinMassey.power).toBe(1);
            expect(this.serJustinMassey.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
