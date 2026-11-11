describe('Blood of Valyria', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Khal Drogo (Core)', attachments: ['Blood of Valyria'] }]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
    });

    it('gives the attached character insight during [power] challenges', function () {
        expect(this.khalDrogo.hasKeyword('Insight')).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
