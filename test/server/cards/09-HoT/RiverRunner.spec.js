describe('River Runner', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['River Runner']
            },
            player2: {
                inPlay: [{ card: 'Tumblestone Knight', power: 1 }, 'Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.riverRunner);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('stops each character with power being declared as a defender while it attacks', function () {
        expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player2).toBeAbleToSelect(this.bastardInHiding);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
