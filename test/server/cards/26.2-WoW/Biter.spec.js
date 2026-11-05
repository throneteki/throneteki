describe('Biter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Biter'] },
            player2: { inPlay: ['Tumblestone Knight', 'Sansa Stark (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.biter);
    });

    it('is sacrificed to kill a character with lower STR that he kneels using intimidate', function () {
        this.player2.clickCard(this.sansaStark);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.biter);

        expect(this.biter.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
