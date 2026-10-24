describe('Ashemark', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    { card: 'Ashemark', gold: 2 },
                    'Tumblestone Knight',
                    'Ser Jaime Lannister (Core)'
                ]
            }
        });

        this.completeMarshalPhase();
        this.player1.triggerAbility(this.ashemark);
    });

    it("kneels and sacrifices to return each character with printed cost X or lower to its owner's hand after a phase begins", function () {
        expect(this.ashemark.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.serJaimeLannister.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
