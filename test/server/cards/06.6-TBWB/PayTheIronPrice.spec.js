describe('Pay The Iron Price', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'Pay The Iron Price', 'Black Wind\'s Crew'
            ]);
            const deck2 = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'Iron Islands Fishmonger', 'Little Bird', 'Fishing Net'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Black Wind\'s Crew', 'hand');
            this.opponentCharacter = this.player2.findCardByName('Iron Islands Fishmonger', 'hand');
            this.positiveAttachment = this.player2.findCardByName('Little Bird', 'hand');
            this.negativeAttachment = this.player2.findCardByName('Fishing Net', 'hand');

            this.player1.clickCard(this.character);
            this.player2.clickCard(this.opponentCharacter);

            this.completeSetup();

            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();

            // Drag attachments to discard
            this.player2.dragCard(this.positiveAttachment, 'discard pile');
            this.player2.dragCard(this.negativeAttachment, 'discard pile');

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
    });
});
