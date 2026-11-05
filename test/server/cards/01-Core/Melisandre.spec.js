describe('Melisandre (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                inPlay: ['Melisandre (Core)'],
                hand: ['Fiery Followers'],
                gold: 3
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.fieryFollowers);
        this.player1.triggerAbility(this.melisandre);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("kneels a character after you marshal a R'hllor card", function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
