describe('Viserion (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Viserion (Core)', 'Daenerys Targaryen (Core)']
            }
        });
    });

    it('gives each Stormborn character you control stealth', function () {
        expect(this.daenerysTargaryen.hasKeyword('Stealth')).toBe(true);
        expect(this.viserion.hasKeyword('Stealth')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
