describe("Nagga's Ribs", function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', [
                'Marched to the Wall',
                'A Noble Cause',
                'Theon Greyjoy (Core)',
                'Theon Greyjoy (Core)',
                "Nagga's Ribs"
            ]);

            const deck2 = this.buildDeck('thenightswatch', [
                'A Noble Cause',
                'Hedge Knight',
                'Now My Watch Begins',
                "Mutiny At Craster's Keep"
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            [this.character1, this.character2] = this.player1.filterCardsByName(
                'Theon Greyjoy',
                'hand'
            );

            this.player1.clickCard(this.character1);
            this.player1.clickCard("Nagga's Ribs", 'hand');

            this.player2.clickCard('Hedge Knight', 'hand');
            this.completeSetup();
        });

        describe('when a character is discarded', function () {
            beforeEach(function () {
                this.player1.selectPlot('Marched to the Wall');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Theon Greyjoy', 'play area');
                this.player2.clickCard('Hedge Knight', 'play area');

                this.player1.triggerAbility("Nagga's Ribs");
            });

            it('should move the card to the dead pile', function () {
                expect(this.character1.location).toBe('dead pile');
            });
        });

        describe('when a dupe is discarded', function () {
            beforeEach(function () {
                this.player2.togglePromptedActionWindow('dominance', true);

                this.player1.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.character2);
                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player2.clickCard("Mutiny At Craster's Keep", 'hand');
                this.player2.clickCard('Hedge Knight', 'play area');
                this.player2.clickCard(this.character1);

                this.player1.triggerAbility("Nagga's Ribs");
            });

            it('should move the dupe to the dead pile', function () {
                expect(this.character2.location).toBe('dead pile');
            });
        });

        describe('vs Now My Watch Begins', function () {
            beforeEach(function () {
                this.player2.togglePromptedActionWindow('dominance', true);

                this.player1.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player2.clickCard("Mutiny At Craster's Keep", 'hand');
                this.player2.clickCard('Hedge Knight', 'play area');
                this.player2.clickCard(this.character1);
            });

            describe('when Now My Watch Begins is triggered first', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Pass');
                    this.player2.triggerAbility('Now My Watch Begins');
                });

                it("should not prompt for Nagga's Ribs", function () {
                    expect(this.player1).not.toAllowAbilityTrigger("Nagga's Ribs");
                });
            });

            describe('when Now My Watch Begins is triggered first', function () {
                beforeEach(function () {
                    this.player1.triggerAbility("Nagga's Ribs");
                });

                it('should not prompt for Now My Watch Begins', function () {
                    expect(this.player2).not.toAllowAbilityTrigger('Now My Watch Begins');
                });
            });
        });
    });
});
