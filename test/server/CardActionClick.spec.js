describe('clicking a card with an action', function () {
    function summary(context, card) {
        const state = context.game.getState(context.player1.player.name);
        return state.players[context.player1.player.name].cardPiles.cardsInPlay.find(
            (cardState) => cardState.uuid === card.uuid
        );
    }

    describe('when the card has one usable action', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['The Kingsroad']
                }
            });
        });

        it('sends no menu while manual mode is off', function () {
            expect(summary(this, this.theKingsroad).menu).toBeUndefined();
        });

        it('uses that action', function () {
            this.player1.clickCard(this.theKingsroad);

            expect(this.theKingsroad.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the card has more than one usable action', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Highgarden (BtB)', 'Paxter Redwyne (Core)'],
                    hand: ['Garden Caretaker']
                }
            });

            this.player1.clickCard(this.highgarden);
        });

        it('asks which action to use', function () {
            expect(this.player1).toHavePrompt('Choose an action');
            expect(this.player1).toHavePromptButton('Give characters +STR');
            expect(this.player1).toHavePromptButton('Return character to hand');
        });

        it('uses the chosen action', function () {
            this.player1.clickPrompt('Return character to hand');
            this.player1.clickCard(this.paxterRedwyne);

            expect(this.paxterRedwyne.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can be cancelled', function () {
            this.player1.clickPrompt('Cancel');

            expect(this.highgarden.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
