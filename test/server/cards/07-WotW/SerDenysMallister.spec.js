describe('Ser Denys Mallister', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Ser Denys Mallister']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serDenysMallister);
        this.player2.clickPrompt('Done');
    });

    it('gains renown while defending', function () {
        expect(this.serDenysMallister.hasKeyword('Renown')).toBe(true);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
