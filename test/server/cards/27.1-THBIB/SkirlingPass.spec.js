describe('Skirling Pass', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Skirling Pass', 'Arya Stark (Core)']
            }
        });
    });

    it('makes each non-Wildling character lose stealth while it is standing', function () {
        expect(this.aryaStark.hasKeyword('Stealth')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
