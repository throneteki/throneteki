describe('Craven', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Tumblestone Knight', attachments: ['Craven'] },
                    'Bastard in Hiding'
                ]
            }
        });
    });

    it('stops the attached character being declared as an attacker', function () {
        this.player1.clickPrompt('Power');

        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player1).toBeAbleToSelect(this.bastardInHiding);

        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
