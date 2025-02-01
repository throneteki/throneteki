describe('Tarle the Thrice-Drowned (FUtG)', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', [
                'Valar Morghulis',
                'Tarle the Thrice-Drowned (FUtG)',
                'Tarle the Thrice-Drowned (FUtG)',
                'Drowned Prophet',
                'Iron Islands Fishmonger',
                'Iron Islands Fishmonger',
                "Drowned God's Blessing"
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            [this.tarle, this.tarleDupe] = this.player1.filterCardsByName(
                'Tarle the Thrice-Drowned'
            );
            this.prophet = this.player1.findCardByName('Drowned Prophet');
            [this.fishmonger1, this.fishmonger2] =
                this.player1.filterCardsByName('Iron Islands Fishmonger');
            this.blessing = this.player1.findCardByName("Drowned God's Blessing");

            // Duple Tarle
            this.player1.clickCard(this.tarle);
            this.player1.clickCard(this.tarleDupe);
            this.completeSetup();
        });

        describe('when a Drowned God character is placed in the dead pile', function () {
            beforeEach(function () {
                this.player1.dragCard(this.prophet, 'dead pile');
            });
            it('should allow Tarle to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger(this.tarle);
            });
        });

        describe('when a Drowned God character is killed', function () {
            beforeEach(function () {
                this.player1.dragCard(this.prophet, 'play area');
                // Trigger Valar Morghulis
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);
            });
            it('should allow Tarle to trigger', function () {
                expect(this.player1).toAllowAbilityTrigger(this.tarle);
            });
        });

        describe('when a character with gained Drowned God trait is killed', function () {
            beforeEach(function () {
                this.player1.dragCard(this.fishmonger1, 'play area');
                this.player1.dragCard(this.blessing, 'play area');
                this.player1.clickCard(this.fishmonger1);
                // Trigger Valar Morghulis
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);
            });
            it('should not allow Tarle to trigger', function () {
                expect(this.player1).not.toAllowAbilityTrigger(this.tarle);
            });
        });

        describe('when a character triggers a self-kill ability, then is put into play by Tarle', function () {
            beforeEach(function () {
                this.player1.dragCard(this.prophet, 'play area');
                this.player1.dragCard(this.fishmonger1, 'draw deck');
                this.player1.dragCard(this.fishmonger2, 'draw deck');
                // Trigger Valar Morghulis
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                // Trigger prophet first time
                this.player1.clickCard(this.prophet);
                this.player1.clickCard(this.fishmonger1);

                // Trigger Tarle on Prophet
                this.player1.clickCard(this.tarle);

                // Kill prophet with Tarle "then" ability
                this.player1.clickCard(this.prophet);
            });
            it('should allow character to trigger self-kill ability again', function () {
                expect(this.player1).toAllowAbilityTrigger(this.prophet);
            });
        });
    });
});
