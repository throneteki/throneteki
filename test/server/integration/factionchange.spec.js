describe('faction change', function () {
    integration(function () {
        describe('when using an attachment to gain faction affiliation', function () {
            beforeEach(function () {
                const deck = this.buildDeck('thenightswatch', [
                    'Sneak Attack',
                    'Confiscation',
                    'Hedge Knight',
                    'Sworn to the Watch',
                    'The Wall (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');

                this.player1.clickCard('The Wall', 'hand');
                this.player1.clickCard(this.character);
                this.player1.clickCard('Sworn to the Watch', 'hand');

                this.completeSetup();

                this.player1.clickCard('Sworn to the Watch', 'play area');
                this.player1.clickCard(this.character);
            });

            it('should grant faction affiliation', function () {
                expect(this.character.isFaction('thenightswatch')).toBe(true);
            });

            it('should recalculate effects for that card', function () {
                // 2 STR base + 1 STR from the Wall
                expect(this.character.getStrength()).toBe(3);
            });

            describe('when the attachment is removed', function () {
                beforeEach(function () {
                    this.player1.selectPlot('Confiscation');
                    this.player2.selectPlot('Sneak Attack');
                    this.selectFirstPlayer(this.player1);

                    // Discard Sworn to the Watch with Confiscation
                    this.player1.clickCard('Sworn to the Watch', 'play area');
                });

                it('should lose faction affiliation', function () {
                    expect(this.character.isFaction('thenightswatch')).toBe(false);
                });

                it('should recalculate effects for that card', function () {
                    // 2 STR base, no more bonus from the Wall.
                    expect(this.character.getStrength()).toBe(2);
                });
            });
        });

        describe('when a character with gained affiliation is killed', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Robb Stark (Core)',
                    'Ward (TS)'
                ]);
                const deck2 = this.buildDeck('targaryen', [
                    'A Noble Cause',
                    'Targaryen Loyalist',
                    'Ser Jorah Mormont (Core)'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player2.findCardByName('Targaryen Loyalist', 'hand');

                this.player1.clickCard('Robb Stark', 'hand');
                this.player2.clickCard(this.character);
                this.player2.clickCard('Ser Jorah Mormont (Core)', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Ward', 'hand');
                this.player1.clickCard(this.character);

                expect(this.character.controller).toBe(this.player1Object);

                // Kneel Robb so his ability can trigger
                this.player1.clickCard('Robb Stark', 'play area');

                this.completeMarshalPhase();

                // Skip Player 1 challenges
                this.player1.clickPrompt('Done');

                this.unopposedChallenge(this.player2, 'Military', 'Ser Jorah Mormont (Core)');

                this.player2.clickPrompt('Apply Claim');
                this.player1.clickCard(this.character);
            });

            it('should count as that affiliation having been killed', function () {
                expect(this.player1).toAllowAbilityTrigger('Robb Stark');
            });
        });
    });
});
