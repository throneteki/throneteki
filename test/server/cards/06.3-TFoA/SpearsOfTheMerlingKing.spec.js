describe('Spears of the Merling King', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Spears of the Merling King', 'Castle Guard'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.triggerAbility('Spears of the Merling King');
    });

    it('sacrifices itself to return a killed character you control to your hand', function () {
        expect(this.spearsOfTheMerlingKing.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
