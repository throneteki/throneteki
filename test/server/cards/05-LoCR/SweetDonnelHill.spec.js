describe('Sweet Donnel Hill', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Grand Maester Pycelle (Core)']
            },
            player2: {
                inPlay: ['Sweet Donnel Hill']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.grandMaesterPycelle);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.sweetDonnelHill);
        this.player2.clickPrompt('Done');
    });

    it('makes each attacking character lose all keywords while he is defending', function () {
        expect(this.grandMaesterPycelle.hasKeyword('Insight')).toBe(false);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
