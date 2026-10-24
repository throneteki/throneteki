describe('Attainted', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Attainted'],
                inPlay: ['Grand Maester Pycelle (Core)']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });

        this.player1.clickCard(this.attainted);
    });

    it("can only be attached to an opponent's character, which loses an [intrigue] icon", function () {
        expect(this.player1).toBeAbleToSelect(this.houseMaester);
        expect(this.player1).not.toBeAbleToSelect(this.grandMaesterPycelle);

        this.player1.clickCard(this.houseMaester);

        expect(this.houseMaester.hasIcon('intrigue')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
