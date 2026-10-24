describe('Faceless Man', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Faceless Man (HoT)'] },
            player2: { deadPile: ['Robb Stark (Core)'] }
        });
        this.player1.clickMenu(
            this.facelessMan,
            "Gain character's icons, keywords, factions and traits"
        );
        this.player1.clickCard(this.robbStark);
    });

    it("gains the chosen dead character's printed icons, keywords, factions and traits until the end of the phase", function () {
        for (const icon of this.robbStark.getIcons()) {
            expect(this.facelessMan.hasIcon(icon)).toBe(true);
        }
        for (const trait of this.robbStark.getTraits()) {
            expect(this.facelessMan.hasTrait(trait)).toBe(true);
        }
        expect(this.facelessMan.isFaction('stark')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
