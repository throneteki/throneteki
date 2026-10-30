describe('Ser Davos Seaworth (TTWDFL)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Ser Davos Seaworth (TTWDFL)']
            }
        });
    });

    it('cannot be killed', function () {
        expect(this.serDavosSeaworth.allowGameAction('kill')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
