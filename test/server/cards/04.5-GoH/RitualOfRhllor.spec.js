describe("Ritual of R'hllor", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Acolyte of the Shadow (ChoS)', 'Robb Stark (Core)'],
                hand: ["Ritual of R'hllor"]
            }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility("Ritual of R'hllor");
        this.player1.clickCard(this.acolyteOfTheShadow);
        this.player1.clickPrompt('Done');
    });

    it("has X standing R'hllor characters gain 1 power after you win dominance", function () {
        expect(this.acolyteOfTheShadow.power).toBe(1);
    });
});
