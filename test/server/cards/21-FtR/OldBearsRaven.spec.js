describe("Old Bear's Raven (FtR)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: [
                    "Old Bear's Raven (FtR)",
                    { card: 'Old Bear Mormont (WotW)', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.oldBearsRaven);
        this.player1.clickCard(this.oldBearMormont);
    });

    it('returns itself to your hand to stand Old Bear Mormont', function () {
        expect(this.oldBearsRaven.location).toBe('hand');
        expect(this.oldBearMormont.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
