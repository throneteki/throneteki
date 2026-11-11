describe('A Tourney for the King', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                plot: 'A Tourney for the King',
                inPlay: ['Tumblestone Knight', 'House Maester']
            }
        });
    });

    it("gives each Knight character you control renown and immunity to opponents' events", function () {
        expect(this.tumblestoneKnight.hasKeyword('Renown')).toBe(true);
        expect(this.houseMaester.hasKeyword('Renown')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
