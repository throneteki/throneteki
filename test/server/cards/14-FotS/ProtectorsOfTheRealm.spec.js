describe('Protectors of the Realm (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Protectors of the Realm (FotS)']
            }
        });
    });

    it('has STR equal to your reserve', function () {
        expect(this.protectorsOfTheRealm.getStrength()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
