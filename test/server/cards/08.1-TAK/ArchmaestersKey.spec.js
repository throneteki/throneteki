describe("Archmaester's Key", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Dreadfort Maester', attachments: ["Archmaester's Key"] },
                    'Tumblestone Knight'
                ],
                drawDeck: ['Hedge Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding'],
                discard: ['Nightmares']
            }
        });
    });

    it("lets you play an event from an opponent's discard pile and places it on its owner's deck bottom", function () {
        const key = this.player1.findCardByName("Archmaester's Key", 'play area');
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');
        expect(this.player1.actionUnavailableReason(key)).toBe(undefined);
        this.player1.clickMenu(key, "Play an event from an opponent's discard pile");
        expect(this.player1).toBeAbleToSelect(this.nightmares);
        this.player1.clickCard(this.nightmares);
        expect(this.player2.actionUnavailableReason(this.nightmares)).toBe('location');

        this.player2.clickPrompt('Pass');
        this.player1.clickCard(this.nightmares);
        expect(this.player1).toBeAbleToSelect(this.bastardInHiding);
        expect(this.nightmares.eventPlacementLocation).toBe('draw deck');
        this.player1.clickCard(this.bastardInHiding);

        expect(this.nightmares.location).toBe('draw deck');
        expect(this.player2Object.drawDeck[this.player2Object.drawDeck.length - 1]).toBe(
            this.nightmares
        );
        expect(this.player1Object.drawDeck).not.toContain(this.nightmares);
        expect(this.player2).isReadyToTakeAction();
    });
});
