describe('Bear Island Loyalist', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Bear Island Loyalist', 'Tumblestone Knight']
            },
            player2: {
                hand: ['Nightmares']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.bearIslandLoyalist);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');
        this.player2.clickCard(this.nightmares);
    });

    it("gives each other participating [stark] character you control immunity to opponents' events", function () {
        expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player2).toBeAbleToSelect(this.bearIslandLoyalist);

        this.player2.clickCard(this.bearIslandLoyalist);
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
