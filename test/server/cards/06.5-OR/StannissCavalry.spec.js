describe("Stannis's Cavalry", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: "Stannis's Cavalry", gold: 2 }], gold: 1 },
            player2: {
                inPlay: [
                    { card: 'Burned Men', kneeling: true },
                    { card: 'Khal Drogo (Core)', kneeling: true }
                ]
            }
        });
        this.player1.togglePromptedActionWindow('standing', true);
        this.completeChallengesPhase();
    });

    it("stops an opponent's characters with printed cost equal to its gold standing in the standing phase, and moves gold from your gold pool to itself during the standing phase", function () {
        expect(this.burnedMen.kneeled).toBe(true);
        expect(this.khalDrogo.kneeled).toBe(false);

        this.player1.clickCard(this.stannissCavalry);

        expect(this.stannissCavalry.gold).toBe(3);
        expect(this.player2).isReadyToTakeAction();
    });
});
