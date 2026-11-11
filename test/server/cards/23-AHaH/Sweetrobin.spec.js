describe('Sweetrobin', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Sneak Attack',
                inPlay: ['Sweetrobin', 'Gates of Winterfell'],
                drawDeck: ['Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.gatesOfWinterfell);
    });

    it("removes a revealed card with printed cost equal to or lower than its owner's initiative from the game", function () {
        this.player1.triggerAbility(this.sweetrobin);

        expect(this.tumblestoneKnight.location).toBe('out of game');
        expect(this.player1).isReadyToTakeAction();
    });
});
