describe('clicking an event in hand', function () {
    function setup(context, gameOptions) {
        context.setupTest({
            phase: 'challenge',
            gameOptions,
            player1: { inPlay: ['Tumblestone Knight'], hand: ['"Lord Renly\'s Ride"'] }
        });
        context.opponentPrompt = context.player2.formatPrompt();
        context.game.cardClicked(context.player1.name, context.lordRenlysRide.uuid);
        context.game.continue();
    }

    describe('while manual mode is off', function () {
        beforeEach(function () {
            setup(this);
        });

        it('asks for confirmation before playing it', function () {
            expect(this.player1).toHavePrompt('Play "Lord Renly\'s Ride"?');
            expect(this.player1).toHavePromptButton('Cancel');
            expect(this.lordRenlysRide.location).toBe('hand');
            expect(this.player2.formatPrompt()).toBe(this.opponentPrompt);
        });

        it('leaves the event in hand when cancelled', function () {
            this.player1.clickPrompt('Cancel');

            expect(this.lordRenlysRide.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('plays it once confirmed', function () {
            this.player1.clickPrompt(this.player1.currentPrompt().buttons[0].text);

            expect(this.player1).toHavePrompt('Select a character');
        });
    });

    it('plays it without asking in manual mode', function () {
        setup(this, { manualMode: true });

        expect(this.player1).toHavePrompt('Select a character');
    });
});
