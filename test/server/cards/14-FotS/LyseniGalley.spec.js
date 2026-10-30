describe('Lyseni Galley', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lyseni Galley', 'Salladhor Saan (FotS)', 'Hedge Knight'] }
        });
    });

    it('gives a Captain or Smuggler +1 STR and stealth', function () {
        this.player1.clickMenu(this.lyseniGalley, 'Give +1 STR');
        this.player1.clickCard(this.salladhorSaan);
        expect(this.lyseniGalley.kneeled).toBe(true);
        expect(this.salladhorSaan.getStrength()).toBe(this.salladhorSaan.getPrintedStrength() + 1);
        expect(this.salladhorSaan.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gives other characters +1 STR only', function () {
        this.player1.clickMenu(this.lyseniGalley, 'Give +1 STR');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() + 1);
        expect(this.hedgeKnight.hasKeyword('Stealth')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
