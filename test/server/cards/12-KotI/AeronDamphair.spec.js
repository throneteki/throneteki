describe('Aeron Damphair (KotI)', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('greyjoy', [
                'Valar Morghulis',
                'Aeron Damphair (KotI)',
                'Aeron Damphair (KotI)',
                'Priest of the Drowned God (NMG)',
                'Iron Islands Fishmonger',
                "Drowned God's Blessing"
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            [this.aeron, this.aeronDupe] = this.player1.filterCardsByName('Aeron Damphair');
            this.priest = this.player1.findCardByName('Priest of the Drowned God');
            this.fishmonger = this.player1.findCardByName('Iron Islands Fishmonger');
            this.blessing = this.player1.findCardByName("Drowned God's Blessing");

            // Dupe Damphair
            this.player1.clickCard(this.aeron);
            this.player1.clickCard(this.aeronDupe);
            this.completeSetup();
        });

        describe('when a another Drowned God character is killed', function () {
            beforeEach(function () {
                this.player1.dragCard(this.priest, 'play area');
                // Ensure a card can be drawn
                this.player1.dragCard(this.fishmonger, 'draw deck');
                // Trigger Valar Morghulis
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);
            });

            it('should allow Aeron to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger(this.aeron);
            });
        });

        describe('when another character with gained Drowned God trait is killed', function () {
            beforeEach(function () {
                this.player1.dragCard(this.fishmonger, 'play area');
                this.player1.dragCard(this.blessing, 'play area');
                this.player1.clickCard(this.fishmonger);
                // Ensure a card can be drawn
                this.player1.dragCard(this.priest, 'draw deck');
                // Trigger Valar Morghulis
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);
            });

            it('should allow Aeron to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger(this.aeron);
            });
        });
    });
});
