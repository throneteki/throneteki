describe("Warrior's Sons (FUtG)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { agenda: 'The Faith Militant', inPlay: ["Warrior's Sons (FUtG)"] },
            player2: { power: 1 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.warriorsSons);
        this.player1.triggerAbility(this.theFaithMilitant);
        this.player1.clickCard(this.warriorsSons);
        this.player1.triggerAbility(this.warriorsSons);
    });

    it('stands after power is moved to it', function () {
        expect(this.warriorsSons.power).toBe(1);
        expect(this.warriorsSons.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
