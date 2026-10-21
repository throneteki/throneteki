describe('Ward (TS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Ward (TS)']
            },
            player2: {
                inPlay: ['House Maester', 'Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickCard(this.ward);
    });

    it('can only be attached to a character with printed cost 4 or lower, which you take control of and which gains the [stark] affiliation', function () {
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.houseMaester);

        expect(this.houseMaester.controller).toBe(this.player1Object);
        expect(this.houseMaester.isFaction('stark')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
