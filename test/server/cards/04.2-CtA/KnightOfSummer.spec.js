describe('Knight of Summer', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'Sailing the Summer Sea',
                inPlay: ['Knight of Summer']
            }
        });
    });

    it('gets +2 STR and renown while there are more Summer than Winter plots revealed', function () {
        expect(this.knightOfSummer.getStrength()).toBe(5);
        expect(this.knightOfSummer.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
