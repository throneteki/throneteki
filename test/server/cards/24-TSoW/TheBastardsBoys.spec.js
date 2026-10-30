describe("The Bastard's Boys (TSoW)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ["The Bastard's Boys (TSoW)"],
                hand: ['Cersei Lannister (Core)', 'Tumblestone Knight']
            }
        });
        this.player1.clickCard(this.theBastardsBoys);
    });

    it('is sacrificed to put a House Bolton or non-stark character with printed cost 5 or lower into play from your hand', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.cerseiLannister);

        expect(this.theBastardsBoys.location).toBe('discard pile');
        expect(this.cerseiLannister.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
