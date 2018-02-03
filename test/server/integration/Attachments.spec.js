describe('attachments', function() {
    integration(function() {
        describe('when an attachment is placed', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Winterfell Steward', 'Milk of the Poppy'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Winterfell Steward', 'hand');

                this.player1.clickCard(this.character);
                this.completeSetup();

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.player2.clickCard('Milk of the Poppy', 'hand');
                this.player2.clickCard(this.character);
            });

            it('should apply the attachment effect', function() {
                expect(this.character.isBlank()).toBe(true);
            });
        });

        describe('when an attachment becomes invalid', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause', 'A Noble Cause', 'Fortified Position',
                    'Maester Aemon (Core)', 'Stinking Drunk'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Maester Aemon', 'hand');
                this.attachment = this.player2.findCardByName('Stinking Drunk', 'hand');

                this.player1.clickCard(this.character);
                this.completeSetup();

                // Use Fortified Position to blank Aemon's "No Attachments" restriction
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('Fortified Position');
                this.selectFirstPlayer(this.player2);

                this.player2.clickCard(this.attachment);
                this.player2.clickCard(this.character);

                expect(this.character.attachments).toContain(this.attachment);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                // Fortified Position goes away, the attachment is no longer valid
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);
            });

            it('should discard the attachment', function() {
                expect(this.attachment.location).toBe('discard pile');
                expect(this.character.attachments).not.toContain(this.attachment);
            });
        });

        describe('when an attachment is dependent on another that gets discarded', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Hedge Knight', 'Sworn to the Watch', 'Practice Blade'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');
                this.attachment = this.player1.findCardByName('Practice Blade', 'hand');
                this.factionAttachment = this.player1.findCardByName('Sworn to the Watch', 'hand');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.factionAttachment);
                this.completeSetup();

                // Place attachment
                this.player1.clickCard(this.factionAttachment);
                this.player1.clickCard(this.character);

                expect(this.character.isFaction('thenightswatch'));

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                expect(this.character.attachments).toContain(this.factionAttachment);
                expect(this.character.attachments).toContain(this.attachment);

                this.player1.dragCard(this.factionAttachment, 'discard pile');
            });

            it('should discard the dependent attachment', function() {
                expect(this.attachment.location).toBe('discard pile');
                expect(this.character.attachments).not.toContain(this.attachment);
            });
        });
    });
});
