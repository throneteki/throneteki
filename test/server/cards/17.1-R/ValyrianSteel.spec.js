describe('Valyrian Steel', function() {
    integration(function() {
        describe('when an attachment enters play', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Valyrian Steel (R)',
                    'Late Summer Feast',
                    'Hedge Knight',
                    'Little Bird (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');
                this.attachment = this.player1.findCardByName('Little Bird (Core)', 'hand');

                this.player1.clickCard(this.character);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);
            });

            it('allows it to trigger', function() {
                expect(this.player1).toAllowAbilityTrigger('Valyrian Steel');
            });
        });

        describe('vs Risen from the Sea', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Valyrian Steel (R)',
                    'Valar Morghulis', 'A Noble Cause',
                    'Theon Greyjoy (Core)', 'Risen from the Sea'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Theon Greyjoy', 'hand');

                this.player1.clickCard(this.character);

                this.completeSetup();

                this.player1.selectPlot('Valar Morghulis');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Risen from the Sea', 'hand');
            });

            it('allows it to trigger', function() {
                expect(this.player1).toAllowAbilityTrigger('Valyrian Steel');
            });
        });
    });
});
