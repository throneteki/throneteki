describe("Cersei's Wheelhouse", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: ["Cersei's Wheelhouse"]
            }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('gains 1 gold or draws 1 card after you become the first player', function () {
        this.player1.triggerAbility(this.cerseisWheelhouse);
        this.player1.clickPrompt('Draw 1 card');

        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
