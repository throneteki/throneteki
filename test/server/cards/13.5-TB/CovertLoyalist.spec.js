describe('Covert Loyalist', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['Tumblestone Knight'],
                hand: ['Khal Drogo (Core)'],
                shadows: ['Covert Loyalist'],
                gold: 0
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.covertLoyalist);
        this.player1.clickCard(this.khalDrogo);
    });

    it('discards a targaryen card with printed cost 4 or higher from your hand to put itself into play from shadows', function () {
        expect(this.khalDrogo.location).toBe('discard pile');
        expect(this.covertLoyalist.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
