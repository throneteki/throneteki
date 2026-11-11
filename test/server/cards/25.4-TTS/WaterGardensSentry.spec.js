describe('Water Gardens Sentry', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['House Maester']
            },
            player2: {
                inPlay: ['Water Gardens Sentry', 'Arianne Martell (Core)']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.houseMaester);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('may defend in [intrigue] challenges while you control a [martell] Lord or Lady', function () {
        expect(this.player2).toBeAbleToSelect(this.waterGardensSentry);

        this.player2.clickCard(this.waterGardensSentry);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
