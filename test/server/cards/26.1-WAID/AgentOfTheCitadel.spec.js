describe('Agent of the Citadel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Agent of the Citadel'],
                shadows: ['Undercity Spymaster'],
                drawDeck: ['Tumblestone Knight'],
                gold: 1
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.agentOfTheCitadel);
        this.player1.triggerAbility(this.agentOfTheCitadel);
    });

    it('reveals the top card of your deck to reduce the cost of the next card you bring out of shadows this phase by 2 after you win a challenge it participates in', function () {
        this.player1.clickCard(this.undercitySpymaster);

        expect(this.undercitySpymaster.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
