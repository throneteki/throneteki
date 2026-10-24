describe('The Blackfish (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['The Blackfish (FtR)', 'House Umber Berserkers']
            }
        });
    });

    it('gives each [stark] Army character you control an [intrigue] icon', function () {
        expect(this.houseUmberBerserkers.hasIcon('intrigue')).toBe(true);
        expect(this.theBlackfish.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
