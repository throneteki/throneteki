describe("Syrio's Training", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'House Maester', attachments: ["Syrio's Training"] }]
            }
        });
    });

    it('gives the attached character a [military] icon', function () {
        expect(this.houseMaester.hasIcon('military')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
