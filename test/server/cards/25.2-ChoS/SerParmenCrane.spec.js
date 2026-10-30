describe('Ser Parmen Crane', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Ser Parmen Crane', 'Ser Bryce Caron (JS)']
            }
        });
    });

    it('gains renown while you control another Rainbow Guard character', function () {
        expect(this.serParmenCrane.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
