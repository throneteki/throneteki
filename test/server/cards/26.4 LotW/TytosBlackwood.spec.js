describe('Tytos Blackwood (LotW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tytos Blackwood (LotW)', 'Khal Drogo (Core)']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tytosBlackwood);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
    });

    it('treats each other character without power as blank while he participates', function () {
        expect(this.khalDrogo.hasKeyword('Renown')).toBe(false);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
