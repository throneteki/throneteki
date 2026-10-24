describe('Change of Plans', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { hand: ['Change of Plans'], plotDeck: ['A Noble Cause'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Change of Plans');
        this.player1.clickCard(this.aNobleCause);
    });

    it('moves a plot from your plot deck to the bottom of your used pile after you lose a challenge', function () {
        expect(this.aNobleCause.location).toBe('revealed plots');
        expect(this.player1Object.getNumberOfUsedPlots()).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
