describe('Ulf Son of Umar', function () {
    describe('after a Clansman enters play under your control', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Ulf Son of Umar'], hand: ['Burned Men'] }
            });
            this.player1.clickCard(this.burnedMen);
            this.player1.triggerAbility(this.ulfSonOfUmar);
        });

        it("gets +X STR until the end of the phase, where X is that character's printed STR", function () {
            expect(this.ulfSonOfUmar.getStrength()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
