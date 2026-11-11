describe('Lay Waste', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Lay Waste'] },
            player2: {
                inPlay: [{ card: 'Burned Men', attachments: ["Widow's Wail"] }],
                deck: ['Western Fiefdom', 'The Iron Throne (Core)']
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.westernFiefdom = this.player2.findCardByName('Western Fiefdom', 'draw deck');
        this.ironThrone = this.player2.findCardByName('The Iron Throne (Core)', 'draw deck');
        this.player1.clickCard(this.layWaste);
    });

    it('discards a non-limited location or attachment from play', function () {
        expect(this.player1).toHavePrompt('Select a non-limited location or attachment');

        this.player1.clickCard(this.widowsWail);

        expect(this.widowsWail.location).toBe('discard pile');
    });

    it("lets the discarded card's owner put a cheaper location or attachment into play from their deck", function () {
        this.player1.clickCard(this.widowsWail);

        expect(this.player2).toHavePrompt('Select a card');
        this.player2.clickCard(this.ironThrone);
        expect(this.ironThrone.location).toBe('draw deck');

        this.player2.clickCard(this.westernFiefdom);

        expect(this.westernFiefdom.location).toBe('play area');
        expect(this.westernFiefdom.controller).toBe(this.player2Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
