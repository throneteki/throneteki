describe('Winterfell (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Winterfell (WK)', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.player1.triggerAbility(this.winterfell);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels to take control of a character controlled by the losing opponent after you win an unopposed challenge', function () {
        expect(this.winterfell.kneeled).toBe(true);
        expect(this.burnedMen.controller).toBe(this.player1Object);

        this.completeChallengesPhase();

        expect(this.burnedMen.controller).toBe(this.player2Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
