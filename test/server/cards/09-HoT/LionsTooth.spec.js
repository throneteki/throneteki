describe("Lion's Tooth", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [{ card: 'Ser Jaime Lannister (Core)', attachments: ["Lion's Tooth"] }]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
    });

    it("gives the attached character +1 STR, and sacrifices itself to return a participating character with printed cost 3 or lower to its owner's hand", function () {
        expect(this.serJaimeLannister.getStrength()).toBe(6);

        this.player1.clickCard(this.lionsTooth);
        this.player1.clickCard(this.burnedMen);

        expect(this.lionsTooth.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
