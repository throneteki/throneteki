describe('Shadow keyword', function () {
    integration(function () {
        describe('during setup phase', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Trading with the Pentoshi',
                    'A Noble Cause',
                    'Ser Gerris Drinkwater'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Ser Gerris Drinkwater', 'hand');

                this.player1.clickCard(this.character);
            });

            it('should prompt how to setup the card', function () {
                expect(this.player1).toHavePromptButton('Setup');
                expect(this.player1).toHavePromptButton('Setup in shadows');
            });

            it('should allow the card be setup in shadows', function () {
                this.player1.clickPrompt('Setup in shadows');

                expect(this.character.location).toBe('shadows');
            });

            it('should cost 2 gold to be setup in shadows', function () {
                this.player1.clickPrompt('Setup in shadows');

                expect(this.player1Object.gold).toBe(6);
            });
        });

        describe('during marshal phase', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Trading with the Pentoshi',
                    'A Noble Cause',
                    'Ser Gerris Drinkwater'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Ser Gerris Drinkwater', 'hand');

                this.completeSetup();
                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.character);
            });

            it('should prompt how to marshal the card', function () {
                expect(this.player1).toHavePromptButton('Marshal');
                expect(this.player1).toHavePromptButton('Marshal into shadows');
            });

            it('should allow the card be marshalled in shadows', function () {
                this.player1.clickPrompt('Marshal into shadows');

                expect(this.character.location).toBe('shadows');
            });

            it('should cost 2 gold to be marshalled into shadows', function () {
                this.player1.clickPrompt('Marshal into shadows');

                expect(this.player1Object.gold).toBe(8);
            });
        });

        describe('coming out of shadows', function () {
            beforeEach(function () {
                const deck = this.buildDeck('stark', [
                    'Trading with the Pentoshi',
                    'A Noble Cause',
                    'The Queen of Thorns (TMoW)',
                    'The Queen of Thorns (TMoW)',
                    'Beneath the Bridge of Dream',
                    'Bowels of Casterly Rock',
                    'A Pinch of Powder'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.character, this.dupe] = this.player1.filterCardsByName(
                    'The Queen of Thorns',
                    'hand'
                );

                this.player1.clickCard('Bowels of Casterly Rock');
            });

            describe('as a character', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.character);
                    this.player1.clickPrompt('Setup in shadows');
                    this.completeSetup();
                    this.player1.selectPlot('Trading with the Pentoshi');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    this.player1.clickCard(this.character);
                });

                it('should put the card into play', function () {
                    expect(this.character.location).toBe('play area');
                });

                it('should cost the shadow cost on the card', function () {
                    // 10 gold from Pentoshi - 4 Shadow cost for the character
                    expect(this.player1Object.gold).toBe(6);
                });

                it('should count as coming out of shadow', function () {
                    expect(this.player1).toAllowAbilityTrigger('Bowels of Casterly Rock');
                });
            });

            describe('as a dupe', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.character);
                    this.player1.clickPrompt('Setup');
                    this.completeSetup();
                    this.player1.selectPlot('Trading with the Pentoshi');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.player1.clickCard(this.dupe);
                    this.player1.clickPrompt('Marshal into shadows');

                    this.completeMarshalPhase();

                    this.player1.clickCard(this.dupe);
                });

                it('should put the card into play as a dupe', function () {
                    expect(this.character.dupes).toContain(this.dupe);
                });

                it('should cost the shadow cost on the card', function () {
                    // 10 gold from Pentoshi - 2 cost to put into shadow - 4 Shadow cost for the character
                    expect(this.player1Object.gold).toBe(4);
                });

                it('should count as coming out of shadow', function () {
                    expect(this.player1).toAllowAbilityTrigger('Bowels of Casterly Rock');
                });
            });

            describe('as an event', function () {
                beforeEach(function () {
                    this.player1.clickCard('Beneath the Bridge of Dream');
                    this.completeSetup();
                    this.player1.triggerAbility('Beneath the Bridge of Dream');
                });

                it('should count as coming out of shadow', function () {
                    expect(this.player1).toAllowAbilityTrigger('Bowels of Casterly Rock');
                });
            });

            describe('as an attachment', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.character);
                    this.player1.clickPrompt('Setup');
                    this.completeSetup();
                    this.player1.selectPlot('Trading with the Pentoshi');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.player1.clickCard('A Pinch of Powder', 'hand');

                    this.completeMarshalPhase();

                    this.player1.clickCard('A Pinch of Powder', 'shadows');
                    this.player1.clickCard(this.character);
                });

                it('should cost the shadow cost on the card', function () {
                    // 10 gold from Pentoshi - 2 cost to put into shadow - 1 Shadow cost for the attachment
                    expect(this.player1Object.gold).toBe(7);
                });

                it('should count as coming out of shadow', function () {
                    expect(this.player1).toAllowAbilityTrigger('Bowels of Casterly Rock');
                });
            });

            describe("as an opponent's shadow character", function () {
                beforeEach(function () {
                    this.player1.clickCard(this.character);
                    this.player1.clickPrompt('Setup in shadows');
                    this.completeSetup();
                    this.player1.selectPlot('Trading with the Pentoshi');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    // Complete Player 1 marshalling
                    this.player1.clickPrompt('Done');

                    // Attempt to bring Player 1's character out of shadows
                    this.player2.clickCard(this.character);
                });

                it('should not put the card into play', function () {
                    expect(this.character.location).not.toBe('play area');
                    expect(this.character).not.toBeControlledBy(this.player2);
                });
            });
        });
    });
});
