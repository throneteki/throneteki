describe('Septa Unella (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Septa Unella (WK)', { card: 'Khal Drogo (Core)', power: 1 }]
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.septaUnella);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
    });

    it('treats each other non-The Seven character with power as blank while she participates', function () {
        expect(this.khalDrogo.hasKeyword('Renown')).toBe(false);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
