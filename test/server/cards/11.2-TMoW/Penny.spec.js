describe('Penny', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Penny'],
                shadows: ['Ser Andrey Dalt']
            }
        });
    });

    it('gains an [intrigue] icon and stealth while you control more cards in shadows than each opponent', function () {
        expect(this.penny.hasIcon('intrigue')).toBe(true);
        expect(this.penny.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
