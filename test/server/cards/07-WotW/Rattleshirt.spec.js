describe('Rattleshirt', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Rattleshirt']
            },
            player2: {
                inPlay: [
                    'Tumblestone Knight',
                    { card: 'Bastard in Hiding', attachments: ['Little Bird (Core)'] }
                ]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.rattleshirt);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('stops each character without attachments being declared as a defender while he attacks alone', function () {
        expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player2).toBeAbleToSelect(this.bastardInHiding);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
