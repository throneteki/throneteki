describe('The White Shadows', function () {
    describe('when an opponent character is killed', function () {
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

    describe('when Craster is killed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { plot: 'The White Shadows', inPlay: ['Tumblestone Knight'] },
                player2: { inPlay: ['Craster'] }
            });
            this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
            this.player2.clickCard(this.craster);
            this.player1.triggerAbility(this.theWhiteShadows);
        });

        it('puts him into play blank despite his immunity to Omen card effects, and places him in the dead pile at the end of the phase', function () {
            expect(this.craster.location).toBe('play area');
            expect(this.craster.controller).toBe(this.player1Object);
            expect(this.craster.isFullBlank()).toBe(true);

            this.completeChallengesPhase();

            expect(this.craster.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
