describe('Drogon (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Drogon (Core)', 'Daenerys Targaryen (Core)']
            }
        });
    });

    it('gives each Stormborn character you control renown', function () {
        expect(this.daenerysTargaryen.hasKeyword('Renown')).toBe(true);
        expect(this.drogon.hasKeyword('Renown')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
