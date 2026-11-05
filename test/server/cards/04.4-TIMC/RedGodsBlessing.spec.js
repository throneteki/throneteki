describe("Red God's Blessing", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ["Red God's Blessing"] }]
            }
        });
    });

    it("gives the attached character the R'hllor trait and +1 STR for each R'hllor character you control", function () {
        expect(this.tumblestoneKnight.hasTrait("R'hllor")).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
