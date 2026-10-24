describe('Southron Escort', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Tumblestone Knight'],
                shadows: ['Southron Escort', 'Undercity Spymaster'],
                gold: 0
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.southronEscort);
        this.player1.clickCard(this.undercitySpymaster);
    });

    it('discards another card from shadows to put itself into play from shadows', function () {
        expect(this.undercitySpymaster.location).toBe('discard pile');
        expect(this.southronEscort.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
