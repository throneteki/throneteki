describe('intimidate', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('baratheon', [
                'Trading with the Pentoshi',
                'Robert Baratheon (Core)',
                'Dragonstone Faithful',
                'Bastard in Hiding',
                'Maester Cressen',
                'Gendry (NMG)',
                'Grey Wind (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Robert Baratheon', 'hand');

            this.faithful = this.player2.findCardByName('Dragonstone Faithful', 'hand');
            this.bastard = this.player2.findCardByName('Bastard in Hiding', 'hand');
            this.cressen = this.player2.findCardByName('Maester Cressen', 'hand');
            this.gendry = this.player2.findCardByName('Gendry', 'hand');

            this.player2.clickCard(this.faithful);
            this.player2.clickCard(this.bastard);
            this.player2.clickCard(this.cressen);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            // Resolve plot order
            this.selectPlotOrder(this.player1);

            this.player1.clickCard('Grey Wind', 'hand');
            this.player1.clickPrompt('Done');

            this.player2.clickCard('Gendry', 'hand');
            this.player2.clickPrompt('Done');
        });

        describe('when an attacker with intimidate wins', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard('Robert Baratheon', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickCard(this.cressen);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should prompt to kneel characters', function () {
                expect(this.player1).toHavePrompt(
                    'Select a character to intimidate for Robert Baratheon'
                );
            });

            it('should allow a character with strengt up to the winning strength difference to be knelt', function () {
                this.player1.clickCard(this.bastard);

                expect(this.bastard.kneeled).toBe(true);
            });

            it('should not allow character above the winning strength difference to be knelt', function () {
                this.player1.clickCard(this.gendry);

                expect(this.gendry.kneeled).toBe(false);
            });
        });

        describe('when an attacker with multiple intimidates wins', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard('Robert Baratheon', 'play area');
                this.player1.clickCard('Grey Wind', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                // Skip military claim for simplicity.
                this.player2.clickPrompt('Done');
            });

            it('should prompt only once', function () {
                expect(this.player1).toHavePrompt(
                    'Select a character to intimidate for Robert Baratheon'
                );

                this.player1.clickCard(this.gendry);
                expect(this.gendry.kneeled).toBe(true);

                expect(this.player1).not.toHavePrompt(
                    'Select a character to intimidate for Grey Wind'
                );
                expect(this.player1).not.toHavePrompt(
                    'Choose and kneel a character with 10 strength or less'
                );
            });
        });

        describe('when an defender with intimidate wins', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Power');
                this.player2.clickCard(this.faithful);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickCard('Robert Baratheon', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();
            });

            it('should not prompt for intimidate', function () {
                expect(this.player1).not.toHavePrompt(
                    'Choose and kneel a character with 5 strength or less'
                );
            });
        });
    });
});
