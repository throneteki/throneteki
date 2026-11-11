describe('Old Captain (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Old Captain (ChoS)']
            }
        });
    });

    it('gains pillage and renown while it is standing', function () {
        expect(this.oldCaptain.hasKeyword('Pillage')).toBe(true);
        expect(this.oldCaptain.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
