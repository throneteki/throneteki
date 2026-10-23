describe("At Prince Doran's Behest", function () {
    function setup({ player1 = {}, player2 = {} } = {}) {
        this.setupTest({
            phase: 'plot',
            player1: {
                faction: 'martell',
                plotDeck: ["At Prince Doran's Behest", 'Valar Morghulis'],
                inPlay: ['Desert Scavenger'],
                ...player1
            },
            player2: {
                faction: 'stark',
                plotDeck: ['Marched to the Wall', 'A Noble Cause'],
                ...player2
            }
        });
    }

    describe('when Behest is resolved first', function () {
        beforeEach(function () {
            setup.call(this);
            this.player1.selectPlot("At Prince Doran's Behest");
            this.player2.selectPlot('Marched to the Wall');
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.valarMorghulis);
        });

        it('lets the first player choose the order', function () {
            expect(this.player2).toHavePrompt('Choose when revealed order');
            expect(this.player2).toHavePromptButton('player1 - Valar Morghulis');
            expect(this.player2).toHavePromptButton('player2 - Marched to the Wall');
        });

        it('does not automatically resolve the selected plot', function () {
            expect(this.desertScavenger.location).toBe('play area');
        });
    });

    describe('when the resolution order does not need to be chosen', function () {
        beforeEach(function () {
            setup.call(this);
            this.player1.selectPlot("At Prince Doran's Behest");
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player2);
            this.player1.clickCard(this.valarMorghulis);
        });

        it('automatically resolves the selected plot', function () {
            expect(this.desertScavenger.location).toBe('dead pile');
        });
    });

    describe('when interrupts are available for plot reveals', function () {
        beforeEach(function () {
            setup.call(this, { player2: { inPlay: ['Old Nan'] } });
            this.player1.selectPlot("At Prince Doran's Behest");
            this.player2.selectPlot('Marched to the Wall');
            this.player2.clickPrompt('Pass');
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.valarMorghulis);
        });

        it('prompts for those interrupts', function () {
            expect(this.player2).toAllowAbilityTrigger('Old Nan');
        });
    });

    describe('when reactions are available for plot reveals', function () {
        beforeEach(function () {
            setup.call(this, {
                player1: { inPlay: ['Desert Scavenger', "Caswell's Keep"] },
                player2: { drawDeck: ['Old Nan', 'Old Nan'] }
            });
            this.player1.selectPlot("At Prince Doran's Behest");
            this.player2.selectPlot('Marched to the Wall');
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.valarMorghulis);
            this.selectPlotOrder(this.player1);
            this.player1.triggerAbility("Caswell's Keep");
            this.player1.clickPrompt('player2');
            this.player1.clickPrompt('Old Nan');
        });

        it('triggers a reaction for the second plot revealed', function () {
            expect(this.player1).toAllowAbilityTrigger("Caswell's Keep");
        });
    });

    describe('when it is the last card in the plot deck', function () {
        function playFirstRound(inPlay) {
            setup.call(this, {
                player1: {
                    plot: "At Prince Doran's Behest",
                    plotDeck: ['Valar Morghulis'],
                    inPlay
                },
                player2: { plot: 'Marched to the Wall', plotDeck: ['A Noble Cause'] }
            });
            this.player1.selectPlot('Valar Morghulis');
            this.player2.selectPlot('Marched to the Wall');
            this.selectFirstPlayer(this.player1);
            if (inPlay.length > 0) {
                this.player1.clickPrompt('Pass');
            }
            this.completeMarshalPhase();
            this.completeChallengesPhase();
        }

        it('proceeds without prompting to choose a plot', function () {
            playFirstRound.call(this, []);
            this.selectFirstPlayer(this.player1);
            expect(this.game.currentPhase).toBe('marshal');
        });

        it('recycles the plot deck before the reaction window', function () {
            playFirstRound.call(this, ["Caswell's Keep"]);
            this.selectFirstPlayer(this.player1);
            expect(this.player1).toAllowAbilityTrigger("Caswell's Keep");
            expect(this.player1Object.getNumberOfUsedPlots()).toBe(0);
        });
    });

    describe("vs Varys's Riddle", function () {
        beforeEach(function () {
            const plotDeck = [
                "At Prince Doran's Behest",
                "Varys's Riddle",
                'Valar Morghulis',
                'Marched to the Wall'
            ];
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck, inPlay: ['Hedge Knight'] },
                player2: { plotDeck, inPlay: ['Hedge Knight'] }
            });

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

    describe('vs a rains-triggered Pulling The Strings', function () {
        function setupRains(usedPlots = []) {
            this.setupTest({
                phase: 'plot',
                player1: {
                    faction: 'martell',
                    plot: "At Prince Doran's Behest",
                    plotDeck: ['A Storm of Swords', 'A Feast for Crows']
                },
                player2: {
                    faction: 'tyrell',
                    agenda: '"The Rains of Castamere"',
                    plot: 'A Clash of Kings',
                    plotDeck: ['A Game of Thrones', 'Pulling the Strings', 'A Noble Cause'].filter(
                        (plot) => !usedPlots.includes(plot)
                    ),
                    usedPlots,
                    inPlay: ['Highgarden Honor Guard']
                }
            });
            this.player1.selectPlot("At Prince Doran's Behest");
            this.player2.selectPlot('A Clash of Kings');
            this.selectFirstPlayer(this.player2);
            this.player1.clickCard(this.aStormOfSwords);
            this.completeMarshalPhase();
            this.unopposedChallenge(this.player2, 'Intrigue', this.highgardenHonorGuard);
            this.player2.triggerAbility('"The Rains of Castamere"');
            this.player2.clickCard(this.pullingTheStrings);
            this.player2.clickCard(this.atPrinceDoransBehest);
        }

        it('lets the Rains player reveal a scheme', function () {
            setupRains.call(this);
            this.player2.clickCard(this.aGameOfThrones);
            expect(this.aGameOfThrones.location).toBe('active plot');
        });

        it('recycles the plot deck once the last non-Scheme plot is revealed', function () {
            setupRains.call(this);
            this.player2.clickCard(this.aNobleCause);
            expect(this.player2Object.getNumberOfUsedPlots()).toBe(0);
        });

        it("recycles the Rains player's plot deck if it reveals the last card altogether", function () {
            setupRains.call(this, ['A Game of Thrones']);
            this.player2.clickCard(this.aNobleCause);
            expect(this.player2Object.getNumberOfUsedPlots()).toBe(0);
        });
    });

    describe('vs City of Secrets', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    faction: 'martell',
                    plot: "At Prince Doran's Behest",
                    plotDeck: ['Trading with the Pentoshi'],
                    usedPlots: ['City Blockade (FUtG)']
                },
                player2: {
                    faction: 'baratheon',
                    plot: 'City of Secrets',
                    plotDeck: [],
                    usedPlots: ['City of Wealth']
                }
            });
        });

        it('does not recycle the used pile before City of Secrets is evaluated', function () {
            this.player1.selectPlot("At Prince Doran's Behest");
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.tradingWithThePentoshi);
            this.selectPlotOrder(this.player1);
            expect(this.game.currentPhase).toBe('marshal');
            expect(this.player1Object.getNumberOfUsedPlots()).toBe(0);
        });
    });
});
