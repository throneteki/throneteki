describe('Hidden Thorns', function () {
    function setup(inPlay) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Rhaegal (DotE)', ...inPlay], hand: ['Hidden Thorns'] },
            player2: { hand: ['Hedge Knight', 'Varys (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.rhaegal);
        this.player1.triggerAbility('Hidden Thorns');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.varys);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');
    }

    it('has the loser choose and discard 2 cards after you win an intrigue challenge by 5 or more STR', function () {
        setup.call(this, []);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.varys.location).toBe('discard pile');
        expect(this.hiddenThorns.location).toBe('discard pile');
    });

    it('returns to your hand instead of your discard pile if you control The Queen of Thorns', function () {
        setup.call(this, ['The Queen of Thorns (HoT)']);
        expect(this.hiddenThorns.location).toBe('hand');
    });
});
