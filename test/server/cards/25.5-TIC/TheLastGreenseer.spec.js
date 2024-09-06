describe('The Last Greenseer', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('martell', [
                'The Last Greenseer',
                "At Prince Doran's Behest",
                'Snowed Under',
                "Varys's Riddle",
                'Summer Harvest',
                'The Winds of Winter'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.completeSetup();

            this.expectPlotStatsOf = (playerWrapper, income, claim, reserve) => {
                expect(playerWrapper.player.activePlot.getIncome()).toBe(income);
                expect(playerWrapper.player.activePlot.getClaim()).toBe(claim);
                expect(playerWrapper.player.activePlot.getReserve()).toBe(reserve);
            };
        });

        describe("when triggered on At Prince Doran's Behest", function () {
            beforeEach(function () {
                this.player1.selectPlot('The Last Greenseer');
                this.player2.selectPlot("At Prince Doran's Behest");
                // Trigger The Last Greenseer first
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);
                this.player1.clickCard(this.player2.player.activePlot);
            });

            it('should swap base values', function () {
                this.expectPlotStatsOf(this.player1, 0, 0, 0);
                this.expectPlotStatsOf(this.player2, 4, 1, 5);
            });

            describe('and opponent reveals new plot', function () {
                beforeEach(function () {
                    this.player2.clickCard('The Winds of Winter', 'plot deck');
                });

                it('should no longer swap base values', function () {
                    this.expectPlotStatsOf(this.player1, 4, 1, 5);
                    this.expectPlotStatsOf(this.player2, 3, 2, 5);
                });
            });
        });

        // TODO: Add the following tests after FAQ rulings are defined clearly:
        //       - The Last Greenseer on a non-TLG plot in melee
        //       - Varys's Riddle (primarily in a melee game)
        //       - Summer Harvest
        //       - Snowed Under
    });
});
