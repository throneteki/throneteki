describe('Nightflyer (R2)', function () {
    integration(function () {
        describe('when placed into shadows via Tyrion Lannister (TB)', function () {
            beforeEach(function () {
                const deck = this.buildDeck('lannister', [
                    'Fealty',
                    'Late Summer Feast',
                    'Nightflyer (R2)',
                    'Tyrion Lannister (TB)',
                    'The Kingsroad'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.tyrionLannister = this.player1.findCardByName('Tyrion Lannister', 'hand');
                this.nightflyer = this.player1.findCardByName('Nightflyer', 'hand');
                this.kingsroad = this.player1.findCardByName('The Kingsroad', 'hand');

                this.player1.clickCard(this.kingsroad);
                this.player1.clickCard(this.tyrionLannister);
                this.player1.clickPrompt('Setup in shadows');
                this.player1.clickCard(this.nightflyer);
                this.player1.clickPrompt('Setup');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Bring tyrion out of shadows, triggering his reaction to put nightflyer into shadows
                this.player1.clickCard(this.tyrionLannister);
                this.player1.triggerAbility(this.tyrionLannister);
                this.player1.clickCard(this.nightflyer);
            });

            it("keeps its printed Shadow (X) cost rather than Tyrion's granted cost", function () {
                this.player1.clickCard(this.nightflyer);
                this.player1.selectValue(0);
                expect(this.nightflyer.location).toBe('play area');
            });
        });

        describe('when placed into shadows via Assault from the Shadows', function () {
            beforeEach(function () {
                const deck = this.buildDeck('greyjoy', [
                    'Assault from the Shadows',
                    'A Noble Cause',
                    'Nightflyer (R2)',
                    'The Roseroad'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.nightflyer = this.player1.findCardByName('Nightflyer', 'hand');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickMenu('Assault from the Shadows', 'Put card into shadows');
                this.player1.clickCard(this.nightflyer);
            });

            it('allows nightflyer to be brought out of shadows', function () {
                this.player1.clickCard(this.nightflyer);
                expect(this.nightflyer.location).toBe('play area');
            });
        });
    });
});
