describe('Famine', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Famine'
            },
            player2: {
                hand: ['Tumblestone Knight', 'The Kingsroad']
            }
        });

        this.player1.clickPrompt('Done');
    });

    it('increases the cost for each opponent to marshal characters by 1', function () {
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player2Object.gold).toBe(2);

        this.player2.clickCard(this.theKingsroad);

        expect(this.player2Object.gold).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
