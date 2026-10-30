describe('Dawn', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'House Dayne Knight', attachments: ['Dawn'] }]
            }
        });
    });

    it('gives the attached character +1 STR for each plot in your used pile, and intimidate if it is House Dayne', function () {
        expect(this.houseDayneKnight.getStrength()).toBe(
            2 + this.player1Object.getNumberOfUsedPlots()
        );
        expect(this.houseDayneKnight.hasKeyword('Intimidate')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
