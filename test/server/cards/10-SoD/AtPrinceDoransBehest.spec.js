describe("At Prince Doran's Behest", function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('martell', [
                "At Prince Doran's Behest",
                'Valar Morghulis',
                'Desert Scavenger',
                "Caswell's Keep",
                'Brimstone',
                'Nymeria of Ny Sar'
            ]);
            const deck2 = this.buildDeck('stark', [
                'Marched to the Wall',
                'A Noble Cause',
                'Old Nan',
                'Old Nan',
                'Old Nan',
                'Old Nan',
                'Old Nan',
                'Old Nan',
                'Old Nan',
                'Old Nan',
                'Old Nan',
                'Old Nan'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.character = this.player1.findCardByName('Desert Scavenger', 'hand');

            this.player1.clickCard(this.character);
        });

        describe('when Behest is resolved first', function () {
            beforeEach(function () {
                this.completeSetup();

                this.player1.selectPlot("At Prince Doran's Behest");
                this.player2.selectPlot('Marched to the Wall');
                this.selectFirstPlayer(this.player2);

                // Resolve Behest first
                this.selectPlotOrder(this.player1);

                this.player1.clickCard('Valar Morghulis', 'plot deck');
            });

            it('should allow the first player to choose order', function () {
                expect(this.player2).toHavePrompt('Choose when revealed order');
                expect(this.player2).toHavePromptButton('player1 - Valar Morghulis');
                expect(this.player2).toHavePromptButton('player2 - Marched to the Wall');
            });

            it('should not automatically resolve the selected plot', function () {
                expect(this.character.location).toBe('play area');
            });
        });

        describe('when resolution order does not need to be chosen', function () {
            beforeEach(function () {
                this.completeSetup();

                this.player1.selectPlot("At Prince Doran's Behest");
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.player1.clickCard('Valar Morghulis', 'plot deck');
            });

            it('should automatically resolve the selected plot', function () {
                expect(this.character.location).toBe('dead pile');
            });
        });

        describe('when interrupts are available for plot reveals', function () {
            beforeEach(function () {
                this.player2.clickCard('Old Nan', 'hand');
                this.completeSetup();

                this.player1.selectPlot("At Prince Doran's Behest");
                this.player2.selectPlot('Marched to the Wall');

                // Don't use Old Nan to modify the initial plots
                this.player2.clickPrompt('Pass');

                this.selectFirstPlayer(this.player2);

                // Resolve Behest first
                this.selectPlotOrder(this.player1);

                this.player1.clickCard('Valar Morghulis', 'plot deck');
            });

            it('should prompt for those interrupts', function () {
                expect(this.player2).toAllowAbilityTrigger('Old Nan');
            });
        });

        describe('when reactions are available for plot reveals', function () {
            beforeEach(function () {
                this.player1.clickCard("Caswell's Keep", 'hand');
                this.completeSetup();

                this.player1.selectPlot("At Prince Doran's Behest");
                this.player2.selectPlot('Marched to the Wall');

                this.selectFirstPlayer(this.player2);

                // Resolve Behest first
                this.selectPlotOrder(this.player1);

                this.player1.clickCard('Valar Morghulis', 'plot deck');

                // Resolve new set of plots
                this.selectPlotOrder(this.player1);

                // Trigger Caswell's Keep for the first plot
                this.player1.triggerAbility("Caswell's Keep");
                this.player1.clickPrompt('player2');
                this.player1.clickPrompt('Old Nan');
            });

            it('should trigger a reaction for the second plot revealed', function () {
                expect(this.player1).toAllowAbilityTrigger("Caswell's Keep");
            });
        });

        describe('when it is the last card in the plot deck', function () {
            beforeEach(function () {
                this.completeSetup();

                this.player1.selectPlot('Valar Morghulis');
                this.player2.selectPlot('Marched to the Wall');
                this.selectFirstPlayer(this.player1);

                this.selectPlotOrder(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();
                var cardsToDiscard =
                    this.player2.filterCards((card) => card.location === 'hand').length -
                    this.player2.findCardByName('Marched to the Wall').reserve;
                for (let i = 0; i < cardsToDiscard; ++i) {
                    this.player2.clickCard(this.player2.findCardByName('Old Nan', 'hand'));
                }
                this.player2.clickPrompt('Done');
            });

            it('should proceed without prompting to choose a plot', function () {
                this.selectFirstPlayer(this.player1);
                expect(this.game.currentPhase).toBe('marshal');
            });
        });
    });

    describe("vs Varys's Riddle", function () {
        integration(function () {
            beforeEach(function () {
                const deck = this.buildDeck('martell', [
                    "At Prince Doran's Behest",
                    "Varys's Riddle",
                    'Valar Morghulis',
                    'Marched to the Wall'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
                this.completeSetup();

                this.player1.selectPlot("At Prince Doran's Behest");
                this.player2.selectPlot("Varys's Riddle");
                this.selectFirstPlayer(this.player2);
            });

            describe('after revealing a new plot via Riddle', function () {
                beforeEach(function () {
                    // Resolve Varys's Riddle first to copy Behest
                    this.selectPlotOrder(this.player2);
                    this.player2.clickCard('Valar Morghulis', 'plot deck');
                });

                it('should prompt first player for plot order', function () {
                    expect(this.player2).toHavePrompt('Choose when revealed order');
                    expect(this.player2).toHavePromptButton("player1 - At Prince Doran's Behest");
                    expect(this.player2).toHavePromptButton('player2 - Valar Morghulis');
                });
            });

            describe('repeated Behest vs Riddle', function () {
                beforeEach(function () {
                    // Resolve Varys's Riddle first to copy player 1's Behest
                    this.selectPlotOrder(this.player2);

                    // Reveal player 2's Behest
                    this.player2.clickCard("At Prince Doran's Behest", 'plot deck');

                    // Resolve player 1's Behest
                    this.selectPlotOrder(this.player1);

                    // Reveal player 1's Riddle
                    this.player1.clickCard("Varys's Riddle", 'plot deck');

                    // Resolve player 1's Riddle to copy player 2's Behest
                    this.selectPlotOrder(this.player1);

                    // Reveal a normal plot for player 1
                    this.player1.clickCard('Valar Morghulis', 'plot deck');

                    // Resolve player 2's Behest
                    this.selectPlotOrder(this.player2);

                    // Reveal a normal plot for player 2
                    this.player2.clickCard('Valar Morghulis', 'plot deck');
                });

                it('should prompt first player for plot order', function () {
                    expect(this.player2).toHavePrompt('Choose when revealed order');
                    expect(this.player2).toHavePromptButton('player1 - Valar Morghulis');
                    expect(this.player2).toHavePromptButton('player2 - Valar Morghulis');
                });
            });
        });
    });

    describe('vs a rains-triggered Pulling The Strings', function () {
        integration(function () {
            beforeEach(function () {
                const martell = this.buildDeck('martell', [
                    "At Prince Doran's Behest",
                    'A Storm of Swords',
                    'A Feast for Crows'
                ]);
                const tyrellRains = this.buildDeck('tyrell', [
                    '"The Rains of Castamere"',
                    'A Game of Thrones',
                    'A Clash of Kings',
                    'Pulling the Strings',
                    'A Noble Cause',
                    'Highgarden Honor Guard'
                ]);
                this.player1.selectDeck(martell);
                this.player2.selectDeck(tyrellRains);

                this.startGame();
                this.keepStartingHands();

                this.fiveStrIntrigue = this.player2.findCardByName(
                    'Highgarden Honor Guard',
                    'hand'
                );
                this.behest = this.player1.findCardByName("At Prince Doran's Behest", 'plot deck');
                this.crows = this.player1.findCardByName('A Feast for Crows', 'plot deck');
                this.swords = this.player1.findCardByName('A Storm of Swords', 'plot deck');

                this.kings = this.player2.findCardByName('A Clash of Kings', 'plot deck');
                this.thrones = this.player2.findCardByName('A Game of Thrones', 'plot deck');
                this.strings = this.player2.findCardByName('Pulling the Strings', 'plot deck');
                this.cause = this.player2.findCardByName('A Noble Cause', 'plot deck');
                this.rains = this.player2.findCardByName('"The Rains of Castamere"');

                this.player2.clickCard(this.fiveStrIntrigue);
                this.completeSetup();
                this.player1.selectPlot(this.behest);
                this.player2.selectPlot(this.kings);
                this.selectFirstPlayer(this.player2);
                this.player1.clickCard(this.swords);
                this.completeMarshalPhase();
            });

            it('should allow the Rains player to reveal a scheme', function () {
                this.unopposedChallenge(this.player2, 'intrigue', this.fiveStrIntrigue);
                this.player2.triggerAbility(this.rains);
                this.player2.clickCard(this.strings);
                this.player2.clickCard(this.behest);
                this.player2.clickCard(this.thrones);
                this.player2.clickPrompt('Apply Claim');
                expect(this.thrones.location).toBe('active plot');
            });

            it('should not trigger a plot deck recycle while schemes remain', function () {
                this.unopposedChallenge(this.player2, 'intrigue', this.fiveStrIntrigue);
                this.player2.triggerAbility(this.rains);
                this.player2.clickCard(this.strings);
                this.player2.clickCard(this.behest);
                this.player2.clickCard(this.cause);
                this.player2.clickPrompt('Apply Claim');
                expect(this.player2Object.getNumberOfUsedPlots()).toBe(2);
            });

            it('should trigger the rains players plot deck to recycle if it reveals the last card altogether', function () {
                this.player2.dragCard(this.thrones, 'revealed plots');
                this.unopposedChallenge(this.player2, 'intrigue', this.fiveStrIntrigue);
                this.player2.triggerAbility(this.rains);
                this.player2.clickCard(this.strings);
                this.player2.clickCard(this.behest);
                this.player2.clickCard(this.cause);
                this.player2.clickPrompt('Apply Claim');
                expect(this.player2Object.getNumberOfUsedPlots()).toBe(0);
            });
        });
    });

    describe('vs city of secrets', function () {
        integration(function () {
            beforeEach(function () {
                const behestDeck = this.buildDeck('martell', [
                    "At Prince Doran's Behest",
                    'City Blockade',
                    'Trading with the Pentoshi',
                    'The Red Viper (Core)',
                    'The Red Viper (Core)',
                    'The Red Viper (Core)',
                    'Ellaria Sand (SoD)',
                    'Ellaria Sand (SoD)',
                    'Ellaria Sand (SoD)',
                    'The Fowler Twins',
                    'The Fowler Twins',
                    'The Fowler Twins',
                    'House Dayne Knight',
                    'House Dayne Knight',
                    'House Dayne Knight'
                ]);
                const cityOfSecretsDeck = this.buildDeck('baratheon', [
                    'City of Secrets',
                    'City of Wealth',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer',
                    'Vanguard Lancer'
                ]);

                this.player1.selectDeck(behestDeck);
                this.player2.selectDeck(cityOfSecretsDeck);

                this.startGame();
                this.keepStartingHands();

                this.behest = this.player1.findCardByName("At Prince Doran's Behest", 'plot deck');
                this.blockade = this.player1.findCardByName('City Blockade', 'plot deck');
                this.pentoshi = this.player1.findCardByName(
                    'Trading with the Pentoshi',
                    'plot deck'
                );

                this.secrets = this.player2.findCardByName('City of Secrets', 'plot deck');
                this.wealth = this.player2.findCardByName('City of Wealth', 'plot deck');

                this.completeSetup();
            });

            it('should not recycle the used plots pile before City of Secrets is evaluated', function () {
                this.player1.dragCard(this.blockade, 'revealed plots');
                this.player2.dragCard(this.wealth, 'revealed plots');

                this.player1.selectPlot(this.behest);
                //player 2 is forced to select City of Secrets
                this.selectFirstPlayer(this.player2);
                this.selectPlotOrder(this.player1);
                this.player1.clickCard(this.pentoshi);
                this.selectPlotOrder(this.player1);
                //phase should now complete without prompting for discard as both players have a city plot in used pile

                expect(this.game.currentPhase).toBe('marshal');
                //used pile should have recycled after evaluating all when revealeds
                expect(this.player1Object.getNumberOfUsedPlots()).toBe(0);
            });
        });
    });
});
