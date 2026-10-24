describe('The First Snow of Winter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'The First Snow of Winter',
                inPlay: ['Tumblestone Knight', 'Ser Jaime Lannister (Core)']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });

        this.completeMarshalPhase();
    });

    it("returns each character with printed cost 3 or lower to its owner's hand after the challenges phase begins", function () {
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.houseMaester.location).toBe('hand');
        expect(this.serJaimeLannister.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
