describe('Ser Davos Seaworth (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'baratheon',
                inPlay: ['Ser Davos Seaworth (FotS)', 'Robert Baratheon (Core)', 'Hedge Knight']
            },
            player2: { power: 2 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serDavosSeaworth);
        this.player1.triggerAbility('Ser Davos Seaworth');
    });

    it("discards 1 power from the losing opponent's faction card", function () {
        expect(this.player2Object.faction.power).toBe(1);
    });

    it('then has a King character you control gain 1 power', function () {
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.robertBaratheon);
        expect(this.robertBaratheon.power).toBe(1);
    });
});
