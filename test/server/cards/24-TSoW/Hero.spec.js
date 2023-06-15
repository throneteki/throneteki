describe('Hero', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('targaryen', [
                'Trading with the Pentoshi',
                'Hero', 'Dothraki Outriders', 'Dothraki Honor Guard'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.hero = this.player1.findCardByName('Hero');
            this.dothrakiOutriders = this.player1.findCardByName('Dothraki Outriders');
            this.dothrakiHonorGuard = this.player1.findCardByName('Dothraki Honor Guard');

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
                // military challenge with hero and dothraki outriders
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.hero);
                this.player1.clickCard(this.dothrakiOutriders);
                this.player1.clickPrompt('Done');
                // no actions
                this.skipActionWindow();
                // no defense
                this.player2.clickPrompt('Done');
                // no actions
                this.skipActionWindow();
            });

            it('should ask for hero reaction and only target should be dothraki outriders in play', function() {
                expect(this.player1).toAllowAbilityTrigger('Hero');

                this.player1.clickCard(this.hero);

                expect(this.player1).toAllowSelect(this.dothrakiOutriders);
                expect(this.player1).not.toAllowSelect(this.dothrakiHonorGuard);
            });
        });
    });
});
