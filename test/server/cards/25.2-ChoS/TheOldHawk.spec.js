describe('The Old Hawk', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'Sailing the Summer Sea',
                inPlay: ['The Old Hawk', 'Host of the Boneway', { card: 'Ricasso', gold: 2 }]
            }
        });
    });

    it('gives each [martell] character you control with STR 6 or higher renown while there is a Summer plot revealed', function () {
        expect(this.hostOfTheBoneway.hasKeyword('Renown')).toBe(true);
        expect(this.ricasso.hasKeyword('Renown')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
