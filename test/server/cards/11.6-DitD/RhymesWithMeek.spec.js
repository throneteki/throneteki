describe('Rhymes With Meek', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Khal Drogo (Core)'], hand: ['Rhymes With Meek'], gold: 1 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.khalDrogo);
        this.player1.triggerAbility(this.rhymesWithMeek);
    });

    it('draws 2 cards after you win an unopposed challenge', function () {
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
