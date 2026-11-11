describe("Storm's End (AMAF)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                power: 1,
                inPlay: ["Storm's End (AMAF)", 'Tumblestone Knight', 'Eddard Stark (Core)']
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.stormsEnd);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.eddardStark);
        this.player1.clickPrompt('Done');
    });

    it('discards 1 power from your faction card to have 2 characters gain 1 power after you win dominance', function () {
        expect(this.tumblestoneKnight.power).toBe(1);
        expect(this.eddardStark.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
