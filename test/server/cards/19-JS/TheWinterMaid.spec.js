describe('The Winter Maid', function () {
    function reveal(context, usedPlots) {
        context.setupTest({
            phase: 'plot',
            player1: {
                faction: 'tyrell',
                hand: ['"The Winter Maid"'],
                plotDeck: ['Loan from the Iron Bank'],
                usedPlots
            }
        });
        context.player1.selectPlot('Loan from the Iron Bank');
        context.player2.selectPlot('Filler Plot');
        context.player1.clickCard(context.theWinterMaid);
        context.player1.clickCard(context.loanFromTheIronBank);
    }

    it('gives a revealed plot the Winter trait until the end of the round', function () {
        reveal(this, []);
        expect(this.loanFromTheIronBank.hasTrait('Winter')).toBe(true);
    });

    it('returns to your hand when no Summer plot is revealed', function () {
        reveal(this, []);
        expect(this.theWinterMaid.location).toBe('hand');
    });

    it('goes to your discard pile when a Summer plot is revealed', function () {
        reveal(this, ['Time of Plenty']);
        expect(this.loanFromTheIronBank.hasTrait('Winter')).toBe(true);
        expect(this.theWinterMaid.location).toBe('discard pile');
    });
});
