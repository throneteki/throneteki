describe('The Long Winter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['The Long Winter'], power: 2 },
            player2: { plotDeck: ['Time of Plenty'], power: 2 }
        });
        this.player1.selectPlot('The Long Winter');
        this.player2.selectPlot('Time of Plenty');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.player1Object.faction);
    });

    it('has each player without a Summer plot revealed discard 1 power from a card they control', function () {
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2Object.faction.power).toBe(2);
    });
});
