describe('Mance Rayder', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Snowed Under',
                inPlay: ['Mance Rayder'],
                hand: ['Young Spearwife']
            }
        });
    });

    it('gives each Wildling character in your hand ambush, reduced by 1 while there is a Winter plot revealed', function () {
        expect(this.youngSpearwife.isAmbush()).toBe(true);
        expect(this.youngSpearwife.getAmbushCost()).toBe(3);
        expect(this.player1Object.getCostReduction('ambush', this.youngSpearwife)).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
