describe('A Plot Against The Queen', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                hand: ['A Plot Against The Queen'],
                inPlay: [{ card: 'Tumblestone Knight', power: 1 }]
            },
            player2: { inPlay: [{ card: 'Khal Drogo (Core)', power: 1 }] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.aPlotAgainstTheQueen);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.khalDrogo);
    });

    it("returns a character with power to your hand to return a participating character with power to its owner's hand after you lose a power challenge", function () {
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.khalDrogo.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
