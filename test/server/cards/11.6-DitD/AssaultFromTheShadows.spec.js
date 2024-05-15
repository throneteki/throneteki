describe('Assault from the Shadows', function () {
    integration(function () {
        describe('when putting a non-Shadow card into shadows', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Assault from the Shadows',
                    'A Noble Cause',
                    'Hedge Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickMenu('Assault from the Shadows', 'Put card into shadows');
                this.player1.clickCard(this.character);

                // Attempt to bring the card out of shadows
                this.player1.clickCard(this.character);
            });

            it('allows the card to be brought out of shadows', function () {
                expect(this.character.location).toBe('play area');
            });

            it('costs the printed cost of the card', function () {
                // 5 gold from plot - 1 gold from agenda - 2 gold printed cost
                expect(this.player1Object.gold).toBe(2);
            });
        });

        describe('when putting limited cards into shadows', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Assault from the Shadows',
                    'A Noble Cause',
                    'The Roseroad',
                    'The Roseroad'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.location1, this.location2] = this.player1.filterCardsByName(
                    'The Roseroad',
                    'hand'
                );
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                let agenda = this.player1.findCardByName('Assault from the Shadows');
                this.player1.clickMenu(agenda, 'Put card into shadows');
                this.player1.clickCard(this.location2);

                // Marshal a limited card
                this.player1.clickCard(this.location1);

                // Attempt to bring out the shadowed limited card
                this.player1.clickCard(this.location2);
            });

            it('allows the limited card to be brought out of shadows, bypassing the limit', function () {
                expect(this.location2.location).toBe('play area');
            });
        });

        describe("when playing The Hand's Judgment from shadows", function () {
            // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/40072-ruling-assault-from-the-shadows/
            // Assault from the Shadows grants Hand's Judgment and other X cost
            // cards "Shadow (0)" because undefined values default to 0. This
            // allows Hand's Judgment to trigger for 0 gold regardless of the
            // cancelled event's cost.
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Assault from the Shadows',
                    'A Noble Cause',
                    'Varys (Core)',
                    '"The Last of the Giants"',
                    "The Hand's Judgment"
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.judgment = this.player1.findCardByName("The Hand's Judgment", 'hand');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickMenu('Assault from the Shadows', 'Put card into shadows');
                this.player1.clickCard(this.judgment);
                this.player1.clickPrompt('Done');

                this.player2.clickCard('"The Last of the Giants"', 'hand');
                this.player2.clickCard('Varys', 'hand');
            });

            it('allows the player to trigger Judgment', function () {
                expect(this.player1).toAllowAbilityTrigger(this.judgment);
            });

            it('costs 0 gold to trigger Judgment', function () {
                this.player1.triggerAbility(this.judgment);

                // 5 gold from plot - 1 gold from agenda
                expect(this.player1Object.gold).toBe(4);
            });
        });
    });
});
