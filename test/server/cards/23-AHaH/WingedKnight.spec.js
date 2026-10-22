describe('Winged Knight', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Winged Knight', 'Eddard Stark (Core)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.eddardStark);
        this.player1.triggerAbility('Winged Knight');
    });

    it('sacrifices itself to remove a killed Lord from the game instead', function () {
        expect(this.wingedKnight.location).toBe('discard pile');
        expect(this.eddardStark.location).toBe('out of game');
        expect(this.player2).isReadyToTakeAction();
    });
});
