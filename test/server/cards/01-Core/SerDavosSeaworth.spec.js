describe('Ser Davos Seaworth (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Ser Davos Seaworth (Core)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.serDavosSeaworth);
        this.player1.triggerAbility('Ser Davos Seaworth');
    });

    it('returns to your hand instead of your dead pile when killed', function () {
        expect(this.serDavosSeaworth.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
