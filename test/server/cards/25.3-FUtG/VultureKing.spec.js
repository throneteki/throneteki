describe('Vulture King', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'House Dayne Knight', attachments: ['Vulture King (FUtG)'] }],
                drawDeck: ['Castle Guard']
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.houseDayneKnight);
        this.player1.triggerAbility('Vulture King');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Military');
    });

    it('discards the top card of your deck to have a losing character lose a challenge icon until the end of the phase', function () {
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.hedgeKnight.hasIcon('military')).toBe(false);
    });
});
