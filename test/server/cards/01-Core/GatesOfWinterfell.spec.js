describe('Gates of Winterfell', function () {
    function setup(context, topCard) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Gates of Winterfell'],
                drawDeck: [topCard]
            }
        });

        context.player1.clickCard(context.gatesOfWinterfell);
    }

    it('kneels to reveal the top card of your deck, and draws it if it is [stark]', function () {
        setup(this, 'Tumblestone Knight');

        expect(this.gatesOfWinterfell.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not draw a non-[stark] card', function () {
        setup(this, 'House Dayne Knight');

        expect(this.houseDayneKnight.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
