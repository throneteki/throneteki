describe('Honor-Bound', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Grand Maester Pycelle (Core)', attachments: ['Honor-Bound'] },
                    'House Maester',
                    { card: 'Khal Drogo (Core)', attachments: ['Honor-Bound'] }
                ]
            }
        });
    });

    it('gives the attached character +2 STR in [military] challenges, and stops it attacking or defending in [intrigue] challenges', function () {
        this.player1.clickPrompt('Intrigue');

        expect(this.player1).not.toBeAbleToSelect(this.grandMaesterPycelle);

        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');

        expect(this.khalDrogo.getStrength()).toBe(7);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
