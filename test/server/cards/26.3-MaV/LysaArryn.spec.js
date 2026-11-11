describe('Lysa Arryn (MaV)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Lysa Arryn (MaV)', 'Sweetrobin', 'Robb Stark (AtSK)']
            }
        });
    });

    it('makes each House Arryn character you control loyal, and gains the keywords of other loyal characters while your initiative is 0', function () {
        expect(this.sweetrobin.isLoyal()).toBe(true);
        expect(this.lysaArryn.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
