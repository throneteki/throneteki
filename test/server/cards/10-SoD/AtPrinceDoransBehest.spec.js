describe("At Prince Doran's Behest", function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('martell', [
                "At Prince Doran's Behest",
                'Valar Morghulis',
                'Desert Scavenger',
                "Caswell's Keep"
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
});
