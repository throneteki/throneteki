describe('Varys (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Varys (Core)'] },
            player2: { inPlay: ['Arya Stark (TFM)', { card: 'Sansa Stark (Core)', dupes: 1 }] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Varys');
        this.player2.clickPrompt('Done');
    });

    it('removes itself from the game to discard each character simultaneously', function () {
        expect(this.varys.location).toBe('out of game');
        expect(this.aryaStark.location).toBe('discard pile');
        expect(this.sansaStark.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
