describe('The White Shadows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'The White Shadows', inPlay: ['Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player2.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.theWhiteShadows);
    });

    it("puts a character an opponent controls into play under your control blank after it is killed, and places it in its owner's dead pile at the end of the phase", function () {
        expect(this.burnedMen.controller).toBe(this.player1Object);
        expect(this.burnedMen.isFullBlank()).toBe(true);

        this.completeChallengesPhase();

        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
