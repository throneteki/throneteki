describe('Scorching Deserts', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Scorching Deserts'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.scorchingDeserts);
    });

    it('kneels and sacrifices itself to remove a character with fewer than 2 icons from the challenge after it is declared', function () {
        expect(this.scorchingDeserts.location).toBe('discard pile');
        expect(this.burnedMen.isParticipating()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
