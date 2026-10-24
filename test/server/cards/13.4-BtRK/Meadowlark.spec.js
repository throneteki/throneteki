describe('Meadowlark', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: ['Meadowlark'],
                drawDeck: [
                    'Tumblestone Knight',
                    'House Maester',
                    'Ser Jaime Lannister (Core)',
                    'Steward at the Wall'
                ]
            }
        });

        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility(this.meadowlark);
    });

    it('gains a journey token after you reveal a plot, and sacrifices to put a character with printed cost X or lower into play', function () {
        expect(this.meadowlark.tokens.journey).toBe(1);

        this.player1.clickCard(this.meadowlark);

        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.stewardAtTheWall);

        expect(this.meadowlark.location).toBe('discard pile');
        expect(this.stewardAtTheWall.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
