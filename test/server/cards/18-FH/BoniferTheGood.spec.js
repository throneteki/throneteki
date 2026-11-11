describe('Bonifer the Good (FH)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Bonifer the Good (FH)', 'Septon Utt (HMW)']
            }
        });
    });

    it('gives each non-neutral The Seven character you control insight', function () {
        expect(this.boniferTheGood.hasKeyword('Insight')).toBe(true);
        expect(this.septonUtt.hasKeyword('Insight')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
