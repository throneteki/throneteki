describe('Knight of the Reach', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                inPlay: ['Knight of the Reach', 'Margaery Tyrell (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.knightOfTheReach);
        this.player1.triggerAbility(this.knightOfTheReach);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('gives a Lady character 1 power after you win a challenge it is attacking or defending alone in', function () {
        expect(this.margaeryTyrell.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
