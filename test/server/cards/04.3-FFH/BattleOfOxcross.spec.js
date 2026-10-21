describe('Battle of Oxcross', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Battle of Oxcross',
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)', 'House Dayne Knight']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('stops characters with printed cost 4 or higher defending in the first challenge you initiate', function () {
        expect(this.player2).not.toBeAbleToSelect(this.serJaimeLannister);
        expect(this.player2).toBeAbleToSelect(this.houseDayneKnight);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.houseDayneKnight);

        expect(this.player1).isReadyToTakeAction();
    });
});
