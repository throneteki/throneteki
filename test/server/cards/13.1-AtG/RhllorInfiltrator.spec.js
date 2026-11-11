describe("R'hllor Infiltrator", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["R'hllor Infiltrator"] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        this.startingPower = this.player1Object.faction.power;
        this.player1.clickCard(this.rhllorInfiltrator);
    });

    it('gives control of itself to an opponent and gains 1 power for your faction', function () {
        expect(this.rhllorInfiltrator.kneeled).toBe(true);
        expect(this.rhllorInfiltrator).toBeControlledBy(this.player2);
        expect(this.player1Object.faction.power).toBe(this.startingPower + 1);
        expect(this.player2).isReadyToTakeAction();
    });
});
