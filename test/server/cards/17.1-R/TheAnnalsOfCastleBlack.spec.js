describe('The Annals of Castle Black', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', [
                'The Annals of Castle Black (R)',
                'A Noble Cause',
                'Wildling Horde',
                'Lannisport Merchant',
                'The Iron Bank Will Have Its Due',
                'Hear Me Roar!',
                'Tithe',
                'Ahead of the Tide'
            ]);
            const deck2 = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'A Noble Cause',
                'Lannisport Merchant',
                'Hear Me Roar!'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Wildling Horde', 'hand');

            this.completeSetup();

            this.eventCard = this.player1.findCardByName('Hear Me Roar!', 'hand');
            this.eventCard2 = this.player1.findCardByName(
                'The Iron Bank Will Have Its Due',
                'hand'
            );
            this.eventCard3 = this.player1.findCardByName('Tithe', 'hand');
            this.interruptEventCard = this.player1.findCardByName('Ahead of the Tide', 'hand');
            this.character = this.player1.findCardByName('Lannisport Merchant', 'hand');
            this.opponentEventCard = this.player2.findCardByName('Hear Me Roar!', 'hand');

            // Move Ahead of the Tide to draw deck so it won't trigger
            this.player1Object.moveCard(this.interruptEventCard, 'draw deck');
        });

        describe('when playing an event from hand', function () {
            beforeEach(function () {
                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.eventCard);
                this.player1.clickCard(this.character);
            });

            it('should allow the event to trigger', function () {
                expect(this.character.location).toBe('play area');
            });

            it('should remove the event from the game', function () {
                expect(this.eventCard.location).toBe('out of game');
            });
        });

        describe('when playing an event from discard pile', function () {
            beforeEach(function () {
                this.player1Object.moveCard(this.eventCard, 'discard pile');
                this.player1Object.moveCard(this.eventCard2, 'discard pile');
                this.player1Object.moveCard(this.eventCard3, 'discard pile');

                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.eventCard);
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.character);
            });

            it('should allow the event to trigger', function () {
                expect(this.character.location).toBe('play area');
            });

            it('should remove the event from the game', function () {
                expect(this.eventCard.location).toBe('out of game');
            });

            describe('when playing a second event from discard pile', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.eventCard2);
                    expect(this.player1).toHavePrompt('Select card to return to hand');
                    this.player1.clickCard(this.character);
                });

                it('should allow the event to trigger', function () {
                    expect(this.character.location).toBe('hand');
                });

                it('should remove the event from the game', function () {
                    expect(this.eventCard2.location).toBe('out of game');
                });

                describe('when playing a third event from discard pile', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.eventCard3);
                        expect(this.player1).toHavePrompt('Marshal your cards');
                    });

                    it('should not allow the event to trigger and it stays in the discard pile', function () {
                        expect(this.eventCard3.location).toBe('discard pile');
                    });
                });
            });
        });

        describe('when an interrupt / reaction event is in discard', function () {
            beforeEach(function () {
                this.player1Object.moveCard(this.interruptEventCard, 'discard pile');

                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
            });

            it('should allow the event to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger('Ahead of the Tide');
            });

            it('should remove the event from the game if played', function () {
                this.player1.triggerAbility('Ahead of the Tide');

                expect(this.interruptEventCard.location).toBe('out of game');
            });

            it('should remove the effect next round', function () {
                this.player1.clickPrompt('Pass');
                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();
                this.completeChallengesPhase();

                expect(this.player1).not.toAllowAbilityTrigger('Ahead of the Tide');
            });
        });

        describe('when an event is discarded', function () {
            beforeEach(function () {
                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.dragCard(this.eventCard, 'discard pile');
            });

            it('should remove the event from the game', function () {
                expect(this.eventCard.location).toBe('out of game');
            });
        });

        describe('when an event is discarded through pillage', function () {
            beforeEach(function () {
                this.player1.selectPlot('The Annals of Castle Black');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player2Object.moveCard(this.opponentEventCard, 'draw deck');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Power');
                this.player1.clickCard('Wildling Horde', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should remove the event from the game', function () {
                expect(this.opponentEventCard.location).toBe('out of game');
            });
        });
    });
});
