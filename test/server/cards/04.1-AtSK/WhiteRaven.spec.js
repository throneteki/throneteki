describe('White Raven', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'A Song of Summer', inPlay: ['White Raven', 'Tumblestone Knight'] },
            player2: { inPlay: ['Castle Guard'] }
        });
    });

    it('is sacrificed after you lose a power challenge', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.whiteRaven.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('gains 1 power for your faction after you win dominance while a Summer plot is revealed', function () {
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.whiteRaven);
        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
