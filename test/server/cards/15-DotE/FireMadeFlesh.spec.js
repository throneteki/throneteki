describe('Fire Made Flesh', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Fire Made Flesh'],
                inPlay: ['Drogon (Core)'],
                drawDeck: ['Drogon (DotE)']
            }
        });

        this.hatchling = this.drogon;
        this.dragon = this.player1Object.drawDeck[0];
        this.player1.clickCard(this.fireMadeFlesh);
        this.player1.clickCard(this.hatchling);
    });

    it('sacrifices a Hatchling to put a Dragon character with the same title into play', function () {
        expect(this.hatchling.location).toBe('discard pile');

        this.player1.clickCard(this.dragon);

        expect(this.dragon.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
