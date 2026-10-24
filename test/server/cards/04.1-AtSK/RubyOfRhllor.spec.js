describe("Ruby of R'hllor", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Acolyte of the Shadow (ChoS)', attachments: ["Ruby of R'hllor"] }]
            },
            player2: { hand: ['Hedge Knight', 'Hedge Knight', 'Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.acolyteOfTheShadow);
        this.player1.triggerAbility("Ruby of R'hllor");
        this.player1.nameCard('Hedge Knight');
        this.player2.clickPrompt('Done');
    });

    it("discards each card in the loser's hand with the named title", function () {
        const names = this.player2Object.hand.map((card) => card.name);
        expect(names).not.toContain('Hedge Knight');
    });
});
