describe('Ser Mark Mullendore', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Mark Mullendore'],
                drawDeck: ['Tumblestone Knight']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.serMarkMullendore);
        this.player1.triggerAbility(this.serMarkMullendore);
    });

    it('reveals the top card of your deck after you win a challenge he participates in, and may swap himself for it', function () {
        this.player1.clickPrompt('Yes');

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.serMarkMullendore.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
