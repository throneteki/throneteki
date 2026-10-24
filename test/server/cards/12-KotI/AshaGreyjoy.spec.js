describe('Asha Greyjoy (KotI)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Asha Greyjoy (KotI)', 'Balon Greyjoy (Core)', 'Salty Navigator']
            }
        });
    });

    it('gives each other unique Ironborn character you control stealth', function () {
        expect(this.balonGreyjoy.hasKeyword('Stealth')).toBe(true);
        expect(this.saltyNavigator.hasKeyword('Stealth')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
