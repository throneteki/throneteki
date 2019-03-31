describe('The Crow is a Tricksy Bird', function() {
    integration(function() {
        describe('when the selected plot is moved to the used pile', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('thenightswatch', [
                    'Ranger\'s Cache', 'A Noble Cause', 'Trading with the Pentoshi',
                    'Valar Morghulis', 'A Clash of Kings', 'A Storm of Swords',
                    'A Storm of Swords',
                    'The Crow is a Tricksy Bird'
                ]);
                const deck2 = this.buildDeck('martell', [
                    'A Noble Cause', 'A Noble Cause', 'Trading with the Pentoshi',
                    'Valar Morghulis', 'A Clash of Kings', 'A Storm of Swords',
                    'A Storm of Swords',
                    'Ser Gerris Drinkwater'
                ]);

                this.player1.togglePromptedActionWindow('plot', true);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.gerris = this.player2.findCardByName('Ser Gerris Drinkwater', 'hand');
                this.player2.clickCard(this.gerris);
                this.player2.clickPrompt('Setup in shadows');

                this.completeSetup();

                this.player1.selectPlot('Ranger\'s Cache');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);
                this.skipActionWindow();

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player1.triggerAbility('Ranger\'s Cache');
                this.player1.clickPrompt('Gain 3 gold');

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);
            });

            describe('when there is only 1 copy of that plot', function() {
                beforeEach(function() {
                    this.selectedPlot = this.player2.findCardByName('Valar Morghulis', 'plot deck');
                    this.player1.clickCard('The Crow is a Tricksy Bird', 'hand');
                    this.player1.clickPrompt(this.selectedPlot.name);

                    this.player2.clickPrompt('Pass');
                    this.player1.clickPrompt('Pass');

                    // Marshal phase
                    this.player1.clickPrompt('Done');
                    // Use Gerris to swap the Tricksy'd plot into the used pile
                    this.player2.clickCard(this.gerris);
                    this.player2.triggerAbility(this.gerris);
                    this.player2.clickCard(this.selectedPlot);
                    this.player2.clickCard('A Noble Cause', 'revealed plots');
                    this.player2.clickPrompt('Done');

                    this.completeChallengesPhase();

                    this.player1.selectPlot('A Clash of Kings');
                    this.player2.selectPlot('A Clash of Kings');
                });

                it('should allow the player to select their plot', function() {
                    expect(this.player2Object.activePlot.name).toBe('A Clash of Kings');
                });
            });

            describe('when there are multiple copies of that plot', function() {
                // Tricksy Bird requires you reveal a plot with the same name,
                // not the specific copy chosen. So if you have multiple copies
                // and move one out, you still have to reveal the other copy.
                // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/40015-ruling-crow-is-a-tricksy-bird-change-of-plans/
                beforeEach(function() {
                    this.selectedPlot = this.player2.findCardByName('A Storm of Swords', 'plot deck');
                    this.player1.clickCard('The Crow is a Tricksy Bird', 'hand');
                    this.player1.clickPrompt(this.selectedPlot.name);

                    this.player2.clickPrompt('Pass');
                    this.player1.clickPrompt('Pass');

                    // Marshal phase
                    this.player1.clickPrompt('Done');
                    // Use Gerris to swap the Tricksy'd plot into the used pile
                    this.player2.clickCard(this.gerris);
                    this.player2.triggerAbility(this.gerris);
                    this.player2.clickCard(this.selectedPlot);
                    this.player2.clickCard('A Noble Cause', 'revealed plots');
                    this.player2.clickPrompt('Done');

                    this.completeChallengesPhase();
                });

                it('does not allow the player to select a plot', function() {
                    expect(this.player2).not.toHavePrompt('Select a plot');
                });

                it('automatically selects the chosen plot', function() {
                    this.player1.selectPlot('A Clash of Kings');

                    expect(this.player2Object.activePlot.name).toBe('A Storm of Swords');
                });
            });
        });
    });
});
