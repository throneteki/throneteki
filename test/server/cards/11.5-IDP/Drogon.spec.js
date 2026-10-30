describe('Drogon (IDP)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'targaryen', inPlay: ['Drogon (IDP)'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.drogon);
        this.player1.triggerAbility(this.drogon);
        this.player1.clickCard(this.burnedMen);
    });

    it('gives a character controlled by the losing opponent -4 STR and kills it if its STR is 0 after he wins a challenge attacking', function () {
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
