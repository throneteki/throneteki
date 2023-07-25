describe('Pay The Iron Price', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'Pay The Iron Price', 'Black Wind\'s Crew'
            ]);
            const deck2 = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'Iron Islands Fishmonger', 'Little Bird (Core)', 'Fishing Net', 'Milk of the Poppy', 'Ward (TS)'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Black Wind\'s Crew', 'hand');
            this.opponentCharacter = this.player2.findCardByName('Iron Islands Fishmonger', 'hand');
            this.positiveAttachment = this.player2.findCardByName('Little Bird (Core)', 'hand');
            this.negativeAttachment = this.player2.findCardByName('Fishing Net', 'hand');
            this.milk = this.player2.findCardByName('Milk of the Poppy', 'hand');
            this.ward = this.player2.findCardByName('Ward', 'hand');

            this.player1.clickCard(this.character);
            this.player2.clickCard(this.opponentCharacter);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();

            // Drag attachments to discard
            this.player2.dragCard(this.positiveAttachment, 'discard pile');
            this.player2.dragCard(this.negativeAttachment, 'discard pile');
            this.player2.dragCard(this.milk, 'discard pile');
            this.player2.dragCard(this.ward, 'discard pile');

            this.player1.clickCard('Pay The Iron Price');
        });

        describe('when choosing a normal attachment', function() {
            beforeEach(function() {
                this.player1.clickCard(this.positiveAttachment);
                this.player1.clickCard(this.character);
            });

            it('should control the attachment', function() {
                expect(this.positiveAttachment).toBeControlledBy(this.player1);
            });

            it('should allow it to be attached to their own characters', function() {
                expect(this.character.attachments).toContain(this.positiveAttachment);
            });

            it('should remove the attachment from the player\'s discard pile', function() {
                expect(this.player2Object.discardPile).not.toContain(this.positiveAttachment);
            });
        });

        describe('when choosing an opponent-only attachment', function() {
            beforeEach(function() {
                this.player1.clickCard(this.negativeAttachment);
                this.player1.clickCard(this.opponentCharacter);
            });

            it('should control the attachment', function() {
                expect(this.negativeAttachment).toBeControlledBy(this.player1);
            });

            it('should allow it to be attached to their opponent\'s characters', function() {
                expect(this.opponentCharacter.attachments).toContain(this.negativeAttachment);
            });
        });

        describe('when discarding a controlled attachment', function() {
            beforeEach(function() {
                this.player1.clickCard(this.milk);
                this.player1.clickCard(this.opponentCharacter);

                expect(this.opponentCharacter.isAnyBlank()).toBe(true);

                this.player1Object.discardCard(this.milk);
                this.game.continue();
            });

            it('should undo the effect', function() {
                expect(this.opponentCharacter.isAnyBlank()).toBe(false);
            });

            it('should place the attachment back in the owners discard pile', function() {
                expect(this.milk).toBeControlledBy(this.player2);
                expect(this.milk.location).toBe('discard pile');
            });
        });

        describe('when the attachment takes control', function() {
            beforeEach(function() {
                this.player1.clickCard(this.ward);
                this.player1.clickCard(this.opponentCharacter);

                expect(this.opponentCharacter.attachments).toContain(this.ward);
            });

            it('should take control of the character', function() {
                expect(this.opponentCharacter).toBeControlledBy(this.player1);
            });
        });
    });
});
