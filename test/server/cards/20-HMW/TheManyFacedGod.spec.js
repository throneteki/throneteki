describe('The Many-Faced God', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'The Many-Faced God', inPlay: ['Hedge Knight'] },
            player2: { deadPile: ['Robb Stark (Core)'] }
        });
        this.player1.clickMenu(
            this.theManyFacedGod,
            'Give icons, affiliation, keywords and traits'
        );
        this.player1.clickCard(this.hedgeKnight);
    });

    it("gives a character the printed icons, keywords, factions and traits of the top character in a player's dead pile", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.isFaction('stark')).toBe(true);
        for (const trait of this.robbStark.getTraits()) {
            expect(this.hedgeKnight.hasTrait(trait)).toBe(true);
        }
    });
});
