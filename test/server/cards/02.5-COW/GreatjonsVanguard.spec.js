describe("Greatjon's Vanguard", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ["Greatjon's Vanguard"]
            }
        });
    });

    it('gets +2 STR and renown while there are fewer than 3 plots in your used pile', function () {
        expect(this.greatjonsVanguard.getStrength()).toBe(6);
        expect(this.greatjonsVanguard.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
