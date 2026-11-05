describe("Old Bear's Raven (TS)", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Old Bear Mormont (Core)', attachments: ["Old Bear's Raven (TS)"] }
                ]
            }
        });
    });

    it('gives the attached character stealth, and an [intrigue] icon if it is Old Bear Mormont', function () {
        expect(this.oldBearMormont.hasKeyword('Stealth')).toBe(true);
        expect(this.oldBearMormont.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
