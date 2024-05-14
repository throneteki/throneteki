describe('Mirri Maz Duur', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('targaryen', [
                'Marching Orders',
                'Mirri Maz Duur',
                'The Hound (TtB)',
                'Targaryen Loyalist'
            ]);
            const deck2 = this.buildDeck('targaryen', ['Marching Orders', 'Targaryen Loyalist']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.mirri = this.player1.findCardByName('Mirri Maz Duur', 'hand');
            this.hound = this.player1.findCardByName('The Hound', 'hand');
            this.character = this.player2.findCardByName('Targaryen Loyalist');

            this.player1.clickCard(this.mirri);
            this.player2.clickCard(this.character);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.player1.clickCard(this.hound);

            this.completeMarshalPhase();
        });

        describe('when claim is applied while Mirri attacks alone', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.mirri);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should allow a character to be killed', function () {
                this.player1.triggerAbility('Mirri Maz Duur');
                this.player1.clickCard(this.character);
                expect(this.character.location).toBe('dead pile');
            });
        });

        describe('when a card leaves play after the challenge is won', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.mirri);
                this.player1.clickCard(this.hound);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Choose not to discard a card so the Hound returns to hand
                this.player1.clickPrompt('No');

                this.player1.clickPrompt('Apply Claim');
            });

            it('should consider Mirri to be attacking alone', function () {
                expect(this.player1).toAllowAbilityTrigger('Mirri Maz Duur');
            });
        });
    });
});
