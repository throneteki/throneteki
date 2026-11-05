describe("The Mountain's Skull", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: ['Tumblestone Knight'],
                hand: ["The Mountain's Skull"]
            },
            player2: { inPlay: ["Euron Crow's Eye (Core)"] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player2.clickCard(this.euronCrowsEye);
        this.player1.triggerAbility(this.theMountainsSkull);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("puts itself into play after an opponent's character with printed STR 6 or higher is killed, and gives the attached character +2 STR and renown", function () {
        expect(this.theMountainsSkull.parent).toBe(this.tumblestoneKnight);
        expect(this.tumblestoneKnight.getStrength()).toBe(4);
        expect(this.tumblestoneKnight.hasKeyword('renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
