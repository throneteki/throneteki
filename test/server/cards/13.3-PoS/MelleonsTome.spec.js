describe("Malleon's Tome", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Maester Lomys', attachments: ["Malleon's Tome"] }] },
            player2: { hand: ['Hedge Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.maesterLomys);
        this.player1.triggerAbility("Malleon's Tome");
        this.player1.clickPrompt('Done');
    });

    it("looks at the loser's hand and stands an attached Maester", function () {
        expect(this.maesterLomys.kneeled).toBe(false);
    });
});
