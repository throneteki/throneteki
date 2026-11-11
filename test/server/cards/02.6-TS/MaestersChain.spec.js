describe("Maester's Chain", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: 'Maester Lomys', attachments: ["Maester's Chain"] }]
            },
            player2: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }]
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.maestersChain);
        this.player1.clickCard(this.littleBird);
    });

    it('kneels to discard a Condition attachment during the dominance phase', function () {
        expect(this.maestersChain.kneeled).toBe(true);
        expect(this.littleBird.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
