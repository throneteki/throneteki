describe('Anya Waynwood', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('greyjoy', [
                'Time of Plenty',
                'Anya Waynwood',
                'Lannisport Merchant',
                'Lannisport Merchant',
                'Lannisport Merchant',
                'The Kingsroad'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.anya = this.player1.findCardByName('Anya Waynwood');
            this.location = this.player1.findCardByName('The Kingsroad');
            [this.merchant1, this.merchant2] =
                this.player1.filterCardsByName('Lannisport Merchant');
            this.opponentAnya = this.player2.findCardByName('Anya Waynwood');
            [this.opponentMerchant1, this.opponentMerchant2, this.opponentMerchant3] =
                this.player2.filterCardsByName('Lannisport Merchant');
            this.opponentLocation = this.player2.findCardByName('The Kingsroad');
            this.player1.clickCard(this.anya);
            this.player1.clickCard(this.merchant1);
            this.player1.clickCard(this.merchant2);
            this.player2.clickCard(this.opponentAnya);
            this.player2.clickCard(this.opponentMerchant1);
            this.player2.clickCard(this.opponentMerchant2);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.player1.clickCard(this.location);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.opponentMerchant3);
            this.player2.clickCard(this.opponentLocation);
            this.player2.clickPrompt('Done');

            // Give power to each player to help determine winners
            this.player1Object.faction.power = 1;
            this.player2Object.faction.power = 1;
        });

        describe('when used against a non-participating character', function () {
            it('contributes their STR to the challenge', function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.merchant1);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickCard(this.opponentMerchant1);
                this.player2.clickCard(this.opponentMerchant2);
                this.player2.clickPrompt('Done');

                // Trigger ability
                this.player1.clickMenu(this.anya, 'Contribute STR to challenge');
                this.player1.clickCard(this.location);
                this.player1.clickCard(this.opponentMerchant3);
                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('Pass');

                this.player1.clickPrompt('Apply Claim');

                expect(this.location.kneeled).toBe(true);
                expect(this.player1Object.faction.power).toBe(2);
                expect(this.player2Object.faction.power).toBe(0);
            });
        });

        describe('when used early and the character is declared by opponent', function () {
            it('the effect is overridden by declaring the character', function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.merchant1);
                this.player1.clickPrompt('Done');

                // Trigger ability
                this.player1.clickMenu(this.anya, 'Contribute STR to challenge');
                this.player1.clickCard(this.location);
                this.player1.clickCard(this.opponentMerchant1);
                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('Pass');

                this.player2.clickCard(this.opponentMerchant1);
                this.player2.clickCard(this.opponentMerchant2);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                expect(this.location.kneeled).toBe(true);
                expect(this.player1Object.faction.power).toBe(1);
                expect(this.player2Object.faction.power).toBe(1);
                expect(this.player1).not.toHavePromptButton('Apply Claim');
            });
        });

        describe('when used twice on the same character', function () {
            it('the last effect takes precedence', function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.merchant1);
                this.player1.clickPrompt('Done');

                // Trigger attacker ability
                this.player1.clickMenu(this.anya, 'Contribute STR to challenge');
                this.player1.clickCard(this.location);
                this.player1.clickCard(this.opponentMerchant2);

                // Trigger defender ability
                this.player2.clickMenu(this.opponentAnya, 'Contribute STR to challenge');
                this.player2.clickCard(this.opponentLocation);
                this.player2.clickCard(this.opponentMerchant2);

                this.skipActionWindow();

                this.player2.clickCard(this.opponentMerchant1);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                expect(this.location.kneeled).toBe(true);
                expect(this.player1Object.faction.power).toBe(1);
                expect(this.player2Object.faction.power).toBe(1);
                expect(this.player1).not.toHavePromptButton('Apply Claim');
            });
        });
    });
});
