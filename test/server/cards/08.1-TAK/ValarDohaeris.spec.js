describe('Valar Dohaeris', function () {
    integration(function () {
        describe('simultaneous placement with attachments', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('thenightswatch', [
                    "A Mummer's Farce",
                    'A Noble Cause',
                    'Valar Dohaeris',
                    'Patchface',
                    'Hedge Knight',
                    'Milk of the Poppy',
                    'Citadel Archivist'
                ]);
                const deck2 = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    'A Noble Cause',
                    'Hedge Knight',
                    'Hedge Knight',
                    'Milk of the Poppy',
                    'Milk of the Poppy'
                ]);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                [this.character1, this.character2] = this.player2.filterCardsByName(
                    'Hedge Knight',
                    'hand'
                );
                [this.attachment1, this.attachment2] = this.player2.filterCardsByName(
                    'Milk of the Poppy',
                    'hand'
                );

                this.fool = this.player1.findCardByName('Patchface', 'hand');
                this.character3 = this.player1.findCardByName('Hedge Knight', 'hand');
                this.attachment3 = this.player1.findCardByName('Milk of the Poppy', 'hand');
                this.archivist = this.player1.findCardByName('Citadel Archivist', 'hand');

                this.player1.clickCard(this.fool);
                this.player1.clickCard(this.character3);
                this.player1.clickCard(this.attachment3);

                this.player2.clickCard(this.character1);
                this.player2.clickCard(this.character2);
                this.player2.clickCard(this.attachment1);
                this.player2.clickCard(this.attachment2);

                this.completeSetup();

                this.player1.clickCard(this.attachment3);
                this.player1.clickCard(this.character3);

                this.player2.clickCard(this.attachment1);
                this.player2.clickCard(this.character1);
                this.player2.clickCard(this.attachment2);
                this.player2.clickCard(this.character2);

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                // Get Citadel Archivist attached to the fool
                this.player1Object.moveCard(this.archivist, 'draw deck');

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.fool);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');

                this.player1.clickPrompt('Apply Claim');
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.selectFirstPlayer(this.player2);

                // Select no cards for Dohaeris
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');

                // Don't choose order for bottom for Dohaeris
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');

                // Don't choose order for attachments to discard pile
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');
            });

            it('puts all attachments in discard before triggering archivist', function () {
                expect(this.player1).toAllowAbilityTrigger(this.archivist);
                expect(this.character1.location).toBe('draw deck');
                expect(this.character2.location).toBe('draw deck');
                expect(this.character3.location).toBe('draw deck');
                expect(this.fool.location).toBe('draw deck');
                expect(this.attachment1.location).toBe('discard pile');
                expect(this.attachment2.location).toBe('discard pile');
                expect(this.attachment3.location).toBe('discard pile');
                expect(this.archivist.location).toBe('discard pile');
            });
        });
    });
});
