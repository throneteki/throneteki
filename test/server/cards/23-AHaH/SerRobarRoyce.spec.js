describe('Ser Robar Royce (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Robar Royce (AHaH)', 'Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Power');
    });

    it('cannot attack or defend in the first challenge each player initiates each round, and gives -1 initiative', function () {
        expect(this.player1).not.toBeAbleToSelect(this.serRobarRoyce);

        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1Object.getInitiative()).toBeLessThan(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
