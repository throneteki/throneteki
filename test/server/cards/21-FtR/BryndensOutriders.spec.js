describe("Brynden's Outriders (FtR)", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ["Brynden's Outriders (FtR)", 'The Twins', 'Ser Denys Mallister']
            }
        });
    });

    it('gains stealth while you control a The Riverlands location, and a [power] icon while you control a Commander', function () {
        expect(this.bryndensOutriders.hasKeyword('Stealth')).toBe(true);
        expect(this.bryndensOutriders.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
