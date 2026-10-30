describe('Oxcross Survivors', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Oxcross Survivors', 'Joffrey Baratheon (Core)']
            }
        });
    });

    it('gets +3 STR and assault while you control a [lannister] Lord or Commander character', function () {
        expect(this.oxcrossSurvivors.getStrength()).toBe(4);
        expect(this.oxcrossSurvivors.hasKeyword('Assault')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
