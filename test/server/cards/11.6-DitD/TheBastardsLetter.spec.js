describe("The Bastard's Letter", function () {
    integration(function () {
        describe('normal cases', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Vanguard of the North',
                    'Hedge Knight',
                    "The Bastard's Letter"
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character1 = this.player1.findCardByName('Vanguard of the North', 'hand');
                this.character2 = this.player1.findCardByName('Hedge Knight', 'hand');
                this.event = this.player1.findCardByName("The Bastard's Letter", 'hand');

                this.player1.clickCard(this.character1);
                this.player1.clickCard(this.character2);
                this.player1.clickCard(this.event);

                this.opponentCharacter = this.player2.findCardByName('Hedge Knight', 'hand');
                this.player2.clickCard(this.opponentCharacter);

                this.completeSetup();
                this.selectFirstPlayer(this.player2);
                this.completeMarshalPhase();
            });

            describe('when the player controls kneeling characters', function () {
                beforeEach(function () {
                    // Manually kneel characters
                    this.player1.clickCard(this.character1);
                    this.player1.clickCard(this.character2);

                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.opponentCharacter);
                    this.player2.clickPrompt('Done');

                    this.player1.triggerAbility(this.event);
                    this.player1.clickCard(this.character1);
                    this.player1.clickCard(this.character2);
                    this.player1.clickPrompt('Done');
                });

                it('should stand the selected characters', function () {
                    expect(this.character1.kneeled).toBe(false);
                    expect(this.character2.kneeled).toBe(false);
                });

                describe('when the player wins the challenge', function () {
                    beforeEach(function () {
                        this.skipActionWindow();

                        // Declare defenders
                        this.player1.clickCard(this.character1);
                        this.player1.clickPrompt('Done');

                        this.skipActionWindow();
                    });

                    it('should kill all attackers', function () {
                        expect(this.opponentCharacter.location).toBe('dead pile');
                    });
                });
            });

            describe('when the player controls no kneeling characters', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.opponentCharacter);
                    this.player2.clickPrompt('Done');
                });

                it('should allow the player to trigger the ability', function () {
                    expect(this.player1).toAllowAbilityTrigger(this.event);
                });

                describe('when the player wins the challenge', function () {
                    beforeEach(function () {
                        this.player1.triggerAbility(this.event);

                        // Select no characters to stand
                        this.player1.clickPrompt('Done');

                        this.skipActionWindow();

                        // Declare defenders
                        this.player1.clickCard(this.character1);
                        this.player1.clickPrompt('Done');

                        this.skipActionWindow();
                    });

                    it('should kill all attackers', function () {
                        expect(this.opponentCharacter.location).toBe('dead pile');
                    });
                });
            });
        });
    });
});
