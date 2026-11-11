describe('The Holy Hundred (FtR)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['The Holy Hundred (FtR)', 'Septon Utt (HMW)']
            }
        });
    });

    it('gives each The Seven character you control +1 STR', function () {
        expect(this.septonUtt.getStrength()).toBe(4);
        expect(this.theHolyHundred.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
