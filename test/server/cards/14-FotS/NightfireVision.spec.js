describe('Nightfire Visions', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ['Fiery Followers'],
                hand: ['Nightfire Visions'],
                plotDeck: ['A Noble Cause']
            },
            player2: { plotDeck: ['A Storm of Swords', 'A Game of Thrones'] }
        });
        this.player1.togglePromptedActionWindow('taxation', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.nightfireVisions);
        this.player1.nameTrait('War');
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.handSize = this.player1Object.hand.length;
    });

    it('draws 3 cards if an opponent reveals a plot with the named trait in the next plot phase', function () {
        this.player2.selectPlot('A Storm of Swords');
        this.selectFirstPlayer(this.player1);
        expect(this.player1Object.hand).toHaveLength(this.handSize + 3 + 2);
    });

    it('does not draw cards if they reveal a plot without it', function () {
        this.player2.selectPlot('A Game of Thrones');
        this.selectFirstPlayer(this.player1);
        expect(this.player1Object.hand).toHaveLength(this.handSize + 2);
        expect(this.game.effectEngine.delayedEffects).toEqual([]);
    });
});
