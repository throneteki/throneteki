describe('Ser Rodrik Cassel', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Rodrik Cassel', 'Robb Stark (AtSK)']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serRodrikCassel);
        this.player1.clickPrompt('Done');
    });

    it('gives each unique [stark] character you control insight while he attacks in a [military] challenge', function () {
        expect(this.robbStark.hasKeyword('Insight')).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
