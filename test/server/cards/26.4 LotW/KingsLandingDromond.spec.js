describe("King's Landing Dromond (LotW)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ["King's Landing Dromond (LotW)"], gold: 1 },
            player2: { inPlay: ['Tumblestone Knight', 'Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickCard(this.kingsLandingDromond);
        this.player1.triggerAbility(this.kingsLandingDromond);
    });

    it("returns a character with printed cost 2 or lower to its owner's hand after it comes out of shadows", function () {
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
