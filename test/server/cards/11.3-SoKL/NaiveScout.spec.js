describe('Naive Scout', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight'],
                shadows: ['Ser Andrey Dalt']
            },
            player2: {
                inPlay: ['Naive Scout', 'Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('cannot be declared as a defender while there is a card in shadows', function () {
        expect(this.player2).not.toBeAbleToSelect(this.naiveScout);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
