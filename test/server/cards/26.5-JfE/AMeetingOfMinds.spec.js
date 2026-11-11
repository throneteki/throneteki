describe('A Meeting of Minds', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'A Meeting of Minds',
                inPlay: ['Renly Baratheon (TtB)', 'Tumblestone Knight']
            }
        });
    });

    it('gives each Small Council character you control insight', function () {
        expect(this.renlyBaratheon.hasKeyword('Insight')).toBe(true);
        expect(this.tumblestoneKnight.hasKeyword('Insight')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
