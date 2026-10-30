describe('Rise of the Kraken', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'Rise of the Kraken', inPlay: ['Hedge Knight'] }
        });
        this.startingPower = this.player1Object.faction.power;
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Rise of the Kraken');
    });

    it('gains 2 power instead of 1 for winning an unopposed challenge', function () {
        expect(this.player1Object.faction.power).toBe(this.startingPower + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
