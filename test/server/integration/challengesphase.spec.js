describe('challenges phase', function() {
    integration(function() {
        describe('when a character has stealth', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Sneak Attack',
                    'Tyrion Lannister (Core)', 'Joffrey Baratheon (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.player1.clickCard('Tyrion Lannister', 'hand');
                this.player2.clickCard('Joffrey Baratheon', 'hand');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Tyrion Lannister', 'play area');
                this.player1.clickPrompt('Done');
            });

            it('should prompt for stealth targets before reactions', function() {
                let stealthTarget = this.player2.findCardByName('Joffrey Baratheon', 'play area');

                expect(this.player1).toHavePrompt('Select stealth target for Tyrion Lannister');

                this.player1.clickCard(stealthTarget);

                expect(this.player1).toAllowAbilityTrigger('Tyrion Lannister');
                expect(stealthTarget.stealth).toBe(true);
            });
        });

        describe('when a side has higher strength but no participating characters', function() {
            beforeEach(function() {
                const deck = this.buildDeck('thenightswatch', [
                    'A Noble Cause',
                    'Steward at the Wall', 'The Haunted Forest', 'The Haunted Forest', 'The Shadow Tower (WotN)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.player1.clickCard('Steward at the Wall', 'hand');
                this.player2.clickCard('The Haunted Forest', 'hand');
                this.player2.clickCard('The Haunted Forest', 'hand');
                this.player2.clickCard('The Shadow Tower', 'hand');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard('Steward at the Wall', 'play area');
                this.player1.clickPrompt('Done');

                // Skip attackers declared window
                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                // Skip defenders declared window
                this.skipActionWindow();
            });

            it('should not trigger any win reactions for the defender', function() {
                expect(this.player2).not.toAllowAbilityTrigger('The Shadow Tower');
            });

            it('should complete the challenge', function() {
                expect(this.player1).toHavePromptButton('Military');
                expect(this.player1).toHaveDisabledPromptButton('Intrigue');
                expect(this.player1).toHavePromptButton('Power');
            });
        });

        describe('when initiating a challenge', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Trading with the Pentoshi',
                    'Tyrion Lannister (Core)', 'Dornish Paramour', 'Marya Seaworth', 'Jojen Reed', 'Hedge Knight', 'Lannisport Merchant'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
                this.merchant = this.player2.findCardByName('Lannisport Merchant', 'hand');

                this.player1.clickCard('Tyrion Lannister', 'hand');
                this.player1.clickCard('Dornish Paramour', 'hand');
                this.player2.clickCard(this.knight);
                this.player2.clickCard(this.merchant);
                this.completeSetup();

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player1.clickCard('Marya Seaworth', 'hand');
                this.player1.clickCard('Jojen Reed', 'hand');
                this.completeMarshalPhase();

                this.initiateChallenge = () => {
                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard('Tyrion Lannister', 'play area');
                    this.player1.clickCard('Jojen Reed', 'play area');
                    this.player1.clickCard('Dornish Paramour', 'play area');
                    this.player1.clickPrompt('Done');

                    // Select 2 stealth targets
                    this.player1.clickCard(this.knight);
                    this.player1.clickCard(this.merchant);
                };
            });

            it('should prompt for challenge initiated, attackers declared, and stealth simultaneously', function() {
                this.initiateChallenge();

                expect(this.player1).toAllowAbilityTrigger('Tyrion Lannister');
                expect(this.player1).toAllowAbilityTrigger('Dornish Paramour');
                expect(this.player1).toAllowAbilityTrigger('Marya Seaworth');
            });

            it('should reactions in the same window to generate gold needed to pay costs', function() {
                this.player1Object.gold = 0;
                this.initiateChallenge();
                expect(this.player1).not.toAllowAbilityTrigger('Marya Seaworth');

                this.player1.triggerAbility('Tyrion Lannister');

                expect(this.player1).toAllowAbilityTrigger('Marya Seaworth');
            });

            it('should allow multiple reactions from the same card to be triggered', function() {
                this.initiateChallenge();

                this.player1.triggerAbility('Marya Seaworth');
                this.player1.clickCard(this.knight);
                this.player1.triggerAbility('Marya Seaworth');
                this.player1.clickCard(this.merchant);

                expect(this.knight.kneeled).toBe(true);
                expect(this.merchant.kneeled).toBe(true);
            });
        });

        describe('when cards have keywords', function() {
            beforeEach(function() {
                const deck = this.buildDeck('tyrell', [
                    'Sneak Attack',
                    'Renly Baratheon (FFH)', 'Brienne of Tarth (GoH)', 'Ser Garlan Tyrell (OR)', 'Garden Caretaker'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.renly = this.player1.findCardByName('Renly Baratheon', 'hand');
                this.brienne = this.player1.findCardByName('Brienne of Tarth', 'hand');
                this.garlan = this.player1.findCardByName('Ser Garlan Tyrell', 'hand');
                this.chud = this.player1.findCardByName('Garden Caretaker', 'hand');

                this.player1.dragCard(this.renly, 'play area');
                this.player1.dragCard(this.brienne, 'play area');
                this.player1.dragCard(this.garlan, 'play area');

                this.completeSetup();

                this.selectFirstPlayer(this.player2);

                // Put the remaining card back in draw deck for insight
                this.player1.dragCard(this.chud, 'draw deck');

                this.completeMarshalPhase();

                // Skip player 2's challenges
                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.renly);
                this.player1.clickCard(this.brienne);
                this.player1.clickCard(this.garlan);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                // No defenders
                this.player2.clickPrompt('Done');

                this.skipActionWindow();
            });

            describe('when no settings are set', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Apply Claim');
                });

                it('should apply all keywords automatically', function() {
                    expect(this.chud.location).toBe('hand');
                    expect(this.renly.power).toBe(1);
                    expect(this.brienne.power).toBe(1);
                    expect(this.garlan.power).toBe(1);
                });
            });

            describe('and the first player wants to choose keyword order', function() {
                beforeEach(function() {
                    this.player2.toggleKeywordSettings('chooseOrder', true);

                    this.player1.clickPrompt('Apply Claim');
                });

                it('should allow the first player to choose the order', function() {
                    this.player2.clickPrompt('Insight');

                    expect(this.chud.location).toBe('hand');
                    // No Renown power yet
                    expect(this.player2).toHavePromptButton('Renown');
                    expect(this.renly.power).toBe(0);
                    expect(this.brienne.power).toBe(0);
                    expect(this.garlan.power).toBe(0);
                });

                it('should allow the first player to process all keywords automatically', function() {
                    this.player2.clickPrompt('Automatic');

                    expect(this.chud.location).toBe('hand');
                    expect(this.renly.power).toBe(1);
                    expect(this.brienne.power).toBe(1);
                    expect(this.garlan.power).toBe(1);
                });
            });

            describe('and the winner wants to choose which cards', function() {
                beforeEach(function() {
                    this.player1.toggleKeywordSettings('chooseCards', true);

                    this.player1.clickPrompt('Apply Claim');
                });

                it('should allow the winner to choose cards', function() {
                    expect(this.player1).toHavePrompt('Select insight cards');
                    this.player1.clickPrompt('Done');

                    expect(this.chud.location).toBe('draw deck');

                    expect(this.player1).toHavePrompt('Select renown cards');
                    this.player1.clickCard(this.renly);
                    this.player1.clickCard(this.garlan);
                    this.player1.clickPrompt('Done');

                    expect(this.renly.power).toBe(1);
                    expect(this.brienne.power).toBe(0);
                    expect(this.garlan.power).toBe(1);
                });
            });
        });

        describe('disabling challenge buttons', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Winterfell Steward'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.player1.clickCard('Winterfell Steward', 'hand');
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                // Initiate power challenge
                this.player1.clickPrompt('Power');
                this.player1.clickCard('Winterfell Steward', 'play area');
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');
            });

            it('should disable the used challenge for the current player', function() {
                expect(this.player1).toHaveDisabledPromptButton('Power');
            });

            it('should not disable the used challenge for the next player', function() {
                this.player1.clickPrompt('Done');

                expect(this.player2).toHavePromptButton('Power');
            });
        });
    });
});
