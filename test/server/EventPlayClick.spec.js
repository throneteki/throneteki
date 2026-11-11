describe('clicking an event in hand', function () {
    function setup(context, gameOptions) {
        context.setupTest({
            phase: 'challenge',
            gameOptions,
            player1: { inPlay: ['Tumblestone Knight'], hand: ['"Lord Renly\'s Ride"'] }
        });
        context.game.cardClicked(context.player1.name, context.lordRenlysRide.uuid);
        context.game.continue();
    }

    it('plays it without asking', function () {
        setup(this);

        expect(this.player1).toHavePrompt('Select a character');
    });

    it('plays it without asking in manual mode', function () {
        setup(this, { manualMode: true });

        expect(this.player1).toHavePrompt('Select a character');
    });
});
