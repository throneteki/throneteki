describe('Palace Spearman', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: { inPlay: ['Palace Spearman'] }
        });
    });

    it('gains an [intrigue] icon while you are not the first player', function () {
        expect(this.palaceSpearman.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
