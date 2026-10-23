describe('Hidden Thorns', function () {
    function setup(test, inPlay) {
        test.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Rhaegal (DotE)', ...inPlay], hand: ['Hidden Thorns'] },
            player2: { hand: ['Hedge Knight', 'Varys (Core)'] }
        });
        test.unopposedChallenge(test.player1, 'Intrigue', test.rhaegal);
        test.player1.triggerAbility('Hidden Thorns');
        test.player2.clickCard(test.hedgeKnight);
        test.player2.clickCard(test.varys);
        test.player2.clickPrompt('Done');
        test.player2.clickPrompt('Done');
    }

    it('has the loser choose and discard 2 cards after you win an intrigue challenge by 5 or more STR', function () {
        setup(this, []);
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.varys.location).toBe('discard pile');
        expect(this.hiddenThorns.location).toBe('discard pile');
    });

    it('returns to your hand instead of your discard pile if you control The Queen of Thorns', function () {
        setup(this, ['The Queen of Thorns (HoT)']);
        expect(this.hiddenThorns.location).toBe('hand');
    });
});
