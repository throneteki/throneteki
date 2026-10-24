describe('Ser Osfryd Kettleblack', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Ser Osfryd Kettleblack'],
                hand: ['Tumblestone Knight']
            }
        });
    });

    it('gains renown while you have more cards in hand than each opponent', function () {
        expect(this.serOsfrydKettleblack.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
