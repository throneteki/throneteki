describe('Harry the Heir', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Harry the Heir', power: 1 },
                    'Anya Waynwood',
                    { card: 'The Kingsroad', kneeling: true }
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.harryTheHeir);
        this.player1.triggerAbility(this.harryTheHeir);
    });

    it('gives Anya Waynwood +1 STR for each power on him, and stands a neutral location you control after he wins attacking', function () {
        this.player1.clickCard(this.theKingsroad);

        expect(this.theKingsroad.kneeled).toBe(false);
        expect(this.anyaWaynwood.getStrength()).toBe(4 + this.harryTheHeir.power);
        expect(this.player1).isReadyToTakeAction();
    });
});
