describe('Castle Black Mason', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Castle Black Mason', 'Sworn Brother'],
                drawDeck: ['Tumblestone Knight', 'Little Bird (Core)']
            }
        });

        this.player1.clickCard(this.castleBlackMason);
        this.player1.clickCard(this.castleBlackMason);
        this.player1.clickCard(this.swornBrother);
        this.player1.clickPrompt('Done');
    });

    it('kneels 2 Builder characters to search the top 10 cards of your deck for a location or attachment', function () {
        expect(this.castleBlackMason.kneeled).toBe(true);
        expect(this.swornBrother.kneeled).toBe(true);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.littleBird);

        expect(this.littleBird.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
