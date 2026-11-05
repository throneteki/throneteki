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
                phase: 'challenge',
                player1: {
                    inPlay: ['Gates of Winterfell'],
                    drawDeck: ['Winterfell Steward']
                }
            });
        });

        it('sends no menu while manual mode is off', function () {
            expect(summary(this, this.gatesOfWinterfell).menu).toBeUndefined();
        });

        describe('and the player clicks it', function () {
            beforeEach(function () {
                this.game.cardClicked(this.player1.name, this.gatesOfWinterfell.uuid);
                this.game.continue();
            });

            it('asks for confirmation before using it', function () {
                expect(this.player1).toHavePrompt('Use Gates of Winterfell?');
                expect(this.player1).toHavePromptButton('Reveal top card of deck');
                expect(this.player1).toHavePromptButton('Cancel');
                expect(this.gatesOfWinterfell.kneeled).toBe(false);
                expect(this.winterfellSteward.location).toBe('draw deck');
            });

            it('uses the action once confirmed', function () {
                this.player1.clickPrompt('Reveal top card of deck');

                expect(this.gatesOfWinterfell.kneeled).toBe(true);
                expect(this.winterfellSteward.location).toBe('hand');
                expect(this.player1).isReadyToTakeAction();
            });

            it('can be cancelled', function () {
                this.player1.clickPrompt('Cancel');

                expect(this.gatesOfWinterfell.kneeled).toBe(false);
                expect(this.winterfellSteward.location).toBe('draw deck');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when the card is a cost reducer', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['The Kingsroad']
                }
            });

            this.game.cardClicked(this.player1.name, this.theKingsroad.uuid);
            this.game.continue();
        });

        it('uses it without asking', function () {
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
