describe('Fishing Net', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: [
                    {
                        card: 'House Maester',
                        attachments: [{ card: 'Fishing Net', owner: 'player1' }]
                    },
                    'Bastard in Hiding'
                ]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('stops the attached character being declared as a defender', function () {
        expect(this.player2).not.toBeAbleToSelect(this.houseMaester);
        expect(this.player2).toBeAbleToSelect(this.bastardInHiding);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
