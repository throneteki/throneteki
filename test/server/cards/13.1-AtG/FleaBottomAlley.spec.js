describe('Flea Bottom Alley', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Maester Harmune', 'Ser Jaime Lannister (Core)'],
                inPlay: ['Flea Bottom Alley']
            }
        });
        this.player1.clickCard(this.fleaBottomAlley);
    });

    it('kneels and sacrifices itself to put a cheap thenightswatch character into play from your hand, then draws 1 card', function () {
        expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

        this.player1.clickCard(this.maesterHarmune);

        expect(this.maesterHarmune.location).toBe('play area');
        expect(this.fleaBottomAlley.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
