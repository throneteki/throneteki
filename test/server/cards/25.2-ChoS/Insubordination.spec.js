describe('Insubordination (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player2: {
                inPlay: [
                    {
                        card: 'Ser Jaime Lannister (Core)',
                        attachments: [{ card: 'Insubordination (ChoS)', owner: 'player1' }]
                    }
                ]
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.insubordination);
    });

    it('kneels to kill the attached character after it attacks you alone', function () {
        expect(this.serJaimeLannister.location).toBe('dead pile');

        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player2).isReadyToTakeAction();
    });
});
