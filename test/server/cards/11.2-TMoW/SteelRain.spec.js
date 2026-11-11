describe('"Steel Rain"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Refurbished Hulk'],
                shadows: ['"Steel Rain"'],
                drawDeck: ['Sea Tower']
            }
        });

        this.player1.clickCard(this.steelRain);
        this.player1.clickCard(this.refurbishedHulk);
        this.player1.clickPrompt('Done');
    });

    it('sacrifices [greyjoy] locations to put different [greyjoy] locations with equal or lower cost from your deck into play', function () {
        expect(this.refurbishedHulk.location).toBe('discard pile');

        this.player1.clickCard(this.seaTower);
        this.player1.clickPrompt('Done');

        expect(this.seaTower.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
