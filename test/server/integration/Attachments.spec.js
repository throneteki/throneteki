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

                this.selectFirstPlayer(this.player2);

                this.player2.clickCard('Milk of the Poppy', 'hand');
                this.player2.clickCard(this.character);
            });

            it('should apply the attachment effect', function() {
                expect(this.character.isAnyBlank()).toBe(true);
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

        describe('when a location attachment is blanked', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Catelyn Stark (Core)', 'Brother\'s Robes', 'Winterfell Castle (TRtW)', 'Frozen Solid'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Catelyn Stark', 'hand');
                this.robes = this.player1.findCardByName('Brother\'s Robes', 'hand');
                this.location = this.player1.findCardByName('Winterfell Castle', 'hand');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.robes);
                this.player1.clickCard(this.location);

                this.locationAttachment = this.player2.findCardByName('Frozen Solid', 'hand');

                this.completeSetup();

                // Attach Robes to character
                this.player1.clickCard(this.robes);
                this.player1.clickCard(this.character);

                this.selectFirstPlayer(this.player2);

                // Attach Frozen Solid to the location
                this.player2.clickCard(this.locationAttachment);
                this.player2.clickCard(this.location);

                // Force activation of the robes
                this.player1.clickCard(this.character);
                this.player1.triggerAbility(this.robes);
                this.player1.clickCard(this.locationAttachment);
            });

            it('should discard the attachment', function() {
                expect(this.locationAttachment.location).toBe('discard pile');
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

        describe('when the character an attachment is placed on leaves play', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Winterfell Steward', 'Little Bird'
                ]);
                const deck2 = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Milk of the Poppy'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Winterfell Steward', 'hand');
                this.nonTerminalAttachment = this.player1.findCardByName('Little Bird', 'hand');
                this.terminalAttachment = this.player2.findCardByName('Milk of the Poppy', 'hand');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.nonTerminalAttachment);
                this.completeSetup();

                // Attach the non-terminal attachment
                this.player1.clickCard(this.nonTerminalAttachment);
                this.player1.clickCard(this.character);

                this.selectFirstPlayer(this.player2);

                // Attach the terminal attachment
                this.player2.clickCard(this.terminalAttachment);
                this.player2.clickCard(this.character);

                expect(this.character.attachments).toContain(this.nonTerminalAttachment);
                expect(this.character.attachments).toContain(this.terminalAttachment);

                this.player1.dragCard(this.character, 'dead pile');
            });

            it('should return the non-terminal attachment back to hand', function() {
                expect(this.nonTerminalAttachment.location).toBe('hand');
                expect(this.player1Object.hand).toContain(this.nonTerminalAttachment);
            });

            it('should place the terminal attachment in discard', function() {
                expect(this.terminalAttachment.location).toBe('discard pile');
                expect(this.player2Object.discardPile).toContain(this.terminalAttachment);
            });
        });
    });
});
