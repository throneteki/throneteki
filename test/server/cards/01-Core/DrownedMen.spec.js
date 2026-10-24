describe('Drowned Men', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Drowned Men', 'Refurbished Hulk']
            }
        });
    });

    it('gets +1 STR for each Warship location you control', function () {
        expect(this.drownedMen.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
