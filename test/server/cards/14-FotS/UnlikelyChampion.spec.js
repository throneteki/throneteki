describe('Unlikely Champion', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Unlikely Champion', 'Joffrey Baratheon (Core)']
            }
        });
    });

    it('gains a [power] icon while you control a Lord or Lady character', function () {
        expect(this.unlikelyChampion.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
