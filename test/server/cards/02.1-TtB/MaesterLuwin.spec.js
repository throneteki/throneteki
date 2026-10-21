describe('Maester Luwin', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    'Maester Luwin',
                    'Robb Stark (AtSK)',
                    'Jon Snow (Core)',
                    'Bran Stark (Core)',
                    'Rickon Stark'
                ]
            }
        });
    });

    it("gives Robb Stark insight, Jon Snow stealth, Bran Stark immunity to opponents' plot effects and Rickon Stark pillage", function () {
        expect(this.robbStark.hasKeyword('Insight')).toBe(true);
        expect(this.jonSnow.hasKeyword('Stealth')).toBe(true);
        expect(this.rickonStark.hasKeyword('Pillage')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
