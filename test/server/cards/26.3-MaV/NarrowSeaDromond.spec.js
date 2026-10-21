describe('Narrow Sea Dromond', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Narrow Sea Dromond'], gold: 1 },
            player2: { inPlay: ['Tumblestone Knight', 'Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickCard(this.narrowSeaDromond);
        this.player1.triggerAbility(this.narrowSeaDromond);
    });

    it('kneels a character with printed cost 4 or lower after it comes out of shadows', function () {
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
