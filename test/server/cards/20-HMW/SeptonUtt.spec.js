describe('Septon Utt (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Septon Utt (HMW)', { card: 'Khal Drogo (Core)', gold: 2 }]
            }
        });
    });

    it('gives each unique character you control with 2 or more gold insight', function () {
        expect(this.khalDrogo.hasKeyword('Insight')).toBe(true);
        expect(this.septonUtt.hasKeyword('Insight')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
