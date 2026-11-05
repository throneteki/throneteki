describe('House Dayne Escort', function () {
    it('can be marshaled from your discard pile with 3 or more plots in your used pile', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                discard: ['House Dayne Escort'],
                usedPlots: ['A Noble Cause', 'Sneak Attack', 'Trading with the Pentoshi'],
                gold: 10
            }
        });
        this.player1.clickCard(this.houseDayneEscort);
        expect(this.houseDayneEscort.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot be marshaled from your discard pile with fewer plots in your used pile', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                discard: ['House Dayne Escort'],
                usedPlots: ['A Noble Cause', 'Sneak Attack'],
                gold: 10
            }
        });
        expect(this.player1Object.isCardInPlayableLocation(this.houseDayneEscort, 'marshal')).toBe(
            false
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
