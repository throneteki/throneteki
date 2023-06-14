describe('Hero', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('targaryen', [
                'Trading with the Pentoshi',
                'Hero', 'Dothraki Outriders'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.hero = this.player1.findCardByName('Hero');
            this.dothrakiOutriders = this.player1.findCardByName('Dothraki Outriders');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.player.gold += 8;

            this.player1.clickCard(this.hero);
        });

        describe('when Hero wins a challenge in which he is participating', function() {
            beforeEach(function() {
                // marshall dothraki outriders
                this.player1.clickCard(this.dothrakiOutriders);
                // end marshall phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                // military challenge with hero
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.hero);
                this.player1.clickPrompt('Done');
                // no actions
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
                // no defense
                this.player2.clickPrompt('Done');
                // no actions
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
            });

            it('should not ask for hero reaction, because there are no kneeling armies to stand', function() {
                expect(this.player1).not.toHavePrompt('Any reactions?');
            });
        });

        describe('when Hero wins a challenge in which he is participating', function() {
            beforeEach(function() {
                // end marshall phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                // military challenge with hero
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.hero);
                this.player1.clickPrompt('Done');
                // no actions
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
                // no defense
                this.player2.clickPrompt('Done');
                // no actions
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
            });

            it('should not ask for hero reaction, because there are no armies in play area to stand', function() {
                expect(this.player1).not.toHavePrompt('Any reactions?');
            });
        });

        describe('when Hero wins a challenge in which he is participating', function() {
            beforeEach(function() {
                // marshall dothraki outriders
                this.player1.clickCard(this.dothrakiOutriders);
                // end marshall phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                // military challenge with hero and dothraki outriders
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.hero);
                this.player1.clickCard(this.dothrakiOutriders);
                this.player1.clickPrompt('Done');
                // no actions
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
                // no defense
                this.player2.clickPrompt('Done');
                // no actions
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
            });

            it('should ask for hero reaction, because there are a kneeling army to stand', function() {
                expect(this.player1).toHavePrompt('Any reactions?');
            });
        });
    });
});
