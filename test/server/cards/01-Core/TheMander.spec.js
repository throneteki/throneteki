describe('The Mander', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Mander', 'Khal Drogo (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.khalDrogo);
        this.player1.triggerAbility(this.theMander);
    });

    it('kneels to draw 2 cards after you win a challenge by 5 or more STR', function () {
        expect(this.theMander.kneeled).toBe(true);
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
