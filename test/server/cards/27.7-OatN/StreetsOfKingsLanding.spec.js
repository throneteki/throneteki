// Generated with Claude Code - claude-opus-4-5-20251101
// - 2026-01-25: Implement spec for Streets of King's Landing

describe("Streets of King's Landing", function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                "Streets of King's Landing",
                'A Noble Cause',
                'The Red Keep (Core)',
                'Steward at the Wall',
                'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('stark', ['A Noble Cause', 'Hedge Knight']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.kingsLandingLocation = this.player1.findCardByName('The Red Keep', 'hand');
            this.character = this.player1.findCardByName('Steward at the Wall', 'hand');

            this.completeSetup();
        });

        describe("when no King's Landing location is in play", function () {
            beforeEach(function () {
                this.selectFirstPlayer(this.player1);
            });

            it('should reduce plot gold by 1', function () {
                // A Noble Cause gives 5 gold, reduced by 1 = 4 gold
                expect(this.player1Object.gold).toBe(4);
            });
        });

        describe("when a King's Landing location is in play", function () {
            beforeEach(function () {
                this.player1.dragCard(this.kingsLandingLocation, 'play area');

                this.selectFirstPlayer(this.player1);
            });

            it('should not reduce plot gold', function () {
                // A Noble Cause gives 5 gold
                expect(this.player1Object.gold).toBe(5);
            });
        });

        describe('winning challenges', function () {
            beforeEach(function () {
                this.player1.dragCard(this.kingsLandingLocation, 'play area');
                this.player1.dragCard(this.character, 'play area');

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                // Win a challenge
                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();
            });

            it("should allow kneeling a King's Landing location to gain power", function () {
                expect(this.player1).toAllowAbilityTrigger("Streets of King's Landing");
            });

            describe('when the ability is triggered', function () {
                beforeEach(function () {
                    this.player1.triggerAbility("Streets of King's Landing");
                    this.player1.clickCard(this.kingsLandingLocation);
                });

                it("should kneel the King's Landing location", function () {
                    expect(this.kingsLandingLocation.kneeled).toBe(true);
                });

                it('should gain 1 power on the knelt location', function () {
                    expect(this.kingsLandingLocation.power).toBe(1);
                });
            });
        });
    });
});
