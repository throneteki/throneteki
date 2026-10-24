describe("Margaery's Influence", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ["Margaery's Influence"] }],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.margaerysInfluence);
    });

    it('kneels and pays 1 gold to stand the attached character and remove it from the challenge', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.tumblestoneKnight.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
