describe('Skagos (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Skagos (R)', 'Tumblestone Knight'],
                drawDeck: ['Tumblestone Knight']
            }
        });

        this.inDeck = this.player1Object.drawDeck[0];
        this.player1.clickCard(this.skagos);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('sacrifices a standing [stark] card to put a card with the same title from your deck into play', function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.skagos.location).toBe('shadows');

        this.player1.clickCard(this.inDeck);

        expect(this.inDeck.location).toBe('play area');
        expect(this.inDeck.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
