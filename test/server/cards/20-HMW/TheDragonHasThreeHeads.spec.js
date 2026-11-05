describe('The Dragon Has Three Heads', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Drogon (Core)', 'Rhaegal (Core)'],
                hand: ['The Dragon Has Three Heads']
            }
        });
        this.player1.clickCard(this.theDragonHasThreeHeads);
    });

    it('gives each Dragon you control a keyword for each of Drogon, Rhaegal and Viserion you control', function () {
        expect(this.drogon.hasKeyword('Intimidate')).toBe(true);
        expect(this.rhaegal.hasKeyword('Renown')).toBe(true);
        expect(this.drogon.hasKeyword('Stealth')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
