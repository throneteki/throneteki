describe("Champion's Favor", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Margaery Tyrell (Core)', attachments: ["Champion's Favor"] },
                    'Tumblestone Knight'
                ]
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.championsFavor);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("kneels the attached character to give a participating non-Lady character +X STR, where X is 2 higher than the attached character's STR", function () {
        expect(this.margaeryTyrell.kneeled).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(7);
        expect(this.player2).isReadyToTakeAction();
    });
});
