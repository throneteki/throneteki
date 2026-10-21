describe("Pyromancer's Cache", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ["Pyromancer's Cache"],
                inPlay: ['Heart Tree Grove', 'Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.pyromancersCache);
    });

    it('can only be attached to a location, which is blanked and gains an action to draw 1 card', function () {
        expect(this.player1).toBeAbleToSelect(this.heartTreeGrove);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.heartTreeGrove);

        expect(this.heartTreeGrove.isAnyBlank()).toBe(true);

        this.player1.clickCard(this.heartTreeGrove);

        expect(this.heartTreeGrove.kneeled).toBe(true);
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 kneels Heart Tree Grove to draw 1 card'
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
