describe('"The Song of the Seven"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: "Warrior's Sons (FotOG)", kneeling: true }],
                hand: ['"The Song of the Seven"'],
                gold: 1
            },
            player2: { power: 2, inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.theSongOfTheSeven);
        this.player1.clickCard(this.warriorsSons);
    });

    it("moves 2 power from the winning opponent's faction card to a The Seven character you control after you lose dominance", function () {
        expect(this.warriorsSons.power).toBe(2);
        expect(this.player2Object.faction.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
