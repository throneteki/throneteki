describe("Champion's Challenge", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                plot: "Champion's Challenge",
                inPlay: ['Hedge Knight', 'Winterfell Steward']
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.challenge = this.game.currentChallenge;
        this.player1.triggerAbility("Champion's Challenge");
    });

    it('kneels your highest STR character to end the challenge with no winner or loser', function () {
        expect(this.player1).not.toAllowSelect(this.winterfellSteward);
        this.player1.clickCard(this.hedgeKnight);

        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.challenge.cancelled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
