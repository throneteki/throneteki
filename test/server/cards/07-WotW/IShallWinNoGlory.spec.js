describe('I Shall Win No Glory', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Ranging Party', 'Old Forest Hunter', 'Haunted Forest Scout'],
                hand: ['I Shall Win No Glory']
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.challenge = this.game.currentChallenge;
        this.player1.triggerAbility('I Shall Win No Glory');
        this.player1.clickCard(this.rangingParty);
        this.player1.clickCard(this.oldForestHunter);
        this.player1.clickCard(this.hauntedForestScout);
        this.player1.clickPrompt('Done');
    });

    it('kneels 3 Rangers to end the challenge with no winner or loser', function () {
        expect(this.rangingParty.kneeled).toBe(true);
        expect(this.oldForestHunter.kneeled).toBe(true);
        expect(this.hauntedForestScout.kneeled).toBe(true);
        expect(this.challenge.cancelled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
