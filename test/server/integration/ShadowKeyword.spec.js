describe('Shadow keyword', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('stark', [
                'Trading with the Pentoshi', 'A Noble Cause',
                'Ser Gerris Drinkwater'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Ser Gerris Drinkwater', 'hand');
        });

        describe('during setup phase', function() {
            beforeEach(function() {
                this.player1.clickCard(this.character);
            });

            it('should prompt how to setup the card', function() {
                expect(this.player1).toHavePromptButton('Setup');
                expect(this.player1).toHavePromptButton('Setup in shadows');
            });

            it('should allow the card be setup in shadows', function() {
                this.player1.clickPrompt('Setup in shadows');

                expect(this.character.location).toBe('shadows');
            });

            it('should cost 2 gold to be setup in shadows', function() {
                this.player1.clickPrompt('Setup in shadows');

                expect(this.player1Object.gold).toBe(6);
            });
        });

        describe('during marshal phase', function() {
            beforeEach(function() {
                this.completeSetup();
                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.character);
            });

            it('should prompt how to marshal the card', function() {
                expect(this.player1).toHavePromptButton('Marshal');
                expect(this.player1).toHavePromptButton('Marshal into shadows');
            });

            it('should allow the card be marshalled in shadows', function() {
                this.player1.clickPrompt('Marshal into shadows');

                expect(this.character.location).toBe('shadows');
            });

            it('should cost 2 gold to be marshalled into shadows', function() {
                this.player1.clickPrompt('Marshal into shadows');

                expect(this.player1Object.gold).toBe(8);
            });
        });

        describe('coming out of shadows', function() {
            beforeEach(function() {
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Setup in shadows');
                this.completeSetup();
                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickCard(this.character);
            });

            it('should put the card into play', function() {
                expect(this.character.location).toBe('play area');
            });

            it('should cost the shadow cost on the card', function() {
                // 10 gold from Pentoshi - 5 Shadow cost for the character
                expect(this.player1Object.gold).toBe(5);
            });
        });
    });
});
