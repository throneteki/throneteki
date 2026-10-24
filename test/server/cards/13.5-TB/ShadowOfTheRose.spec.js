describe('Shadow of the Rose', function () {
    function setup(context, plot) {
        context.setupTest({
            phase: 'marshal',
            player1: {
                plot,
                shadows: ['Shadow of the Rose'],
                drawDeck: ['Tumblestone Knight', 'Ser Andrey Dalt']
            }
        });

        context.player1.clickCard(context.shadowOfTheRose);
        context.player1.clickCard(context.serAndreyDalt);
    }

    it('searches the top 10 cards of your deck for a card with shadow and puts it into shadows', function () {
        setup(this, 'Filler Plot');

        expect(this.serAndreyDalt.location).toBe('shadows');
        expect(this.shadowOfTheRose.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns to your hand if there is a Summer plot card revealed', function () {
        setup(this, 'Sailing the Summer Sea');

        expect(this.shadowOfTheRose.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
