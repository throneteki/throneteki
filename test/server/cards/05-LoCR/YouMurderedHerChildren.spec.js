describe('You Murdered Her Children (LoCR)', function () {
    function setup(context, attachments) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'The Red Viper (Core)', attachments }],
                hand: ['You Murdered Her Children (LoCR)']
            }
        });
        context.player1.togglePromptedActionWindow('dominance', true);
        context.player1.clickPrompt('Power');
        context.player1.clickCard(context.theRedViper);
        context.player1.clickPrompt('Done');
        context.player1.clickCard(context.youMurderedHerChildren);
        context.player1.clickCard(context.theRedViper);
    }

    function finishChallenges(context) {
        context.player2.clickPrompt('Pass');
        context.player1.clickPrompt('Pass');
        context.player2.clickPrompt('Done');
        context.skipActionWindow();
        context.player1.clickPrompt('Pass');
        context.completeChallengesPhase();
    }

    describe('when the target can be killed', function () {
        beforeEach(function () {
            setup(this, ['The Boy King']);
        });

        it('doubles the STR of the target, then kills it at the end of the phase', function () {
            expect(this.theRedViper.getStrength()).toBe(14);

            finishChallenges(this);

            expect(this.theRedViper.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the target cannot be killed', function () {
        beforeEach(function () {
            setup(this, ['The Boy King', 'Long May He Reign']);
        });

        it('doubles the STR of the target until the end of the phase, even if it remains in play', function () {
            expect(this.theRedViper.getStrength()).toBe(14);

            finishChallenges(this);

            expect(this.theRedViper.location).toBe('play area');
            expect(this.theRedViper.getStrength()).toBe(7);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
