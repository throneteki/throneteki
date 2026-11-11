describe('Ser Manfrey Martell', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Manfrey Martell']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serManfreyMartell);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
    });

    it('resolves insight and renown for the losing player while he participates', function () {
        expect(this.serJaimeLannister.kneeled).toBe(true);

        this.skipActionWindow();

        expect(this.serManfreyMartell.power).toBe(1);

        expect(this.player1).isReadyToTakeAction();
    });
});
