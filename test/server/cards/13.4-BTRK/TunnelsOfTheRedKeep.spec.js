describe('Tunnels of the Red Keep', function () {
    integration(function () {
        describe('kneeling and returning it to shadows', function () {
            beforeEach(function () {
                const deck = this.buildDeck('tyrell', [
                    'A Noble Cause',
                    'Hedge Knight',
                    'Tunnels of the Red Keep',
                    'Penny'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight');
                this.tunnels = this.player1.findCardByName('Tunnels of the Red Keep');
                this.shadowCard = this.player1.findCardByName('Penny');

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.tunnels);
                this.player1.clickPrompt('Setup');
                this.player1.clickCard(this.shadowCard);
                this.player1.clickPrompt('Setup in shadows');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();

                this.player1.clickMenu(this.tunnels, 'Kneel and return to shadows');
            });

            it('grants +1 STR for each card in shadows', function () {
                // 2 base STR + 2 cards in shadow (including Tunnels)
                expect(this.character.getStrength()).toBe(4);
            });

            it('does not modify the STR if cards come out of shadow', function () {
                this.player1.clickCard(this.shadowCard);

                expect(this.character.getStrength()).toBe(4);
            });
        });
    });
});
