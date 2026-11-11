describe('Old Bear Mormont (WotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['Old Bear Mormont (WotW)'] },
            player2: { discard: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.oldBearMormont);
        this.player1.triggerAbility(this.oldBearMormont);
        this.player1.clickCard(this.burnedMen);
    });

    it("puts a non-unique character from the losing opponent's discard pile into play under your control after you win a challenge he is participating in", function () {
        expect(this.burnedMen.location).toBe('play area');
        expect(this.burnedMen.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
