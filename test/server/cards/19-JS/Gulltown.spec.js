describe('Gulltown', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'City of Wealth',
                'Marching Orders',
                'Marching Orders',
                'Gulltown',
                'Ricasso'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.gulltown = this.player1.findCardByName('Gulltown');
            this.ricasso = this.player1.findCardByName('Ricasso');
            this.completeSetup();

            this.player1.selectPlot('City of Wealth');
            this.player2.selectPlot('City of Wealth');
            this.selectFirstPlayer(this.player1);
        });

        describe('when Gulltown is not in play', function () {
            beforeEach(function () {});

            it('the number of plots in the used pile should be 0', function () {
                expect(this.player1Object.getNumberOfUsedPlots()).toBe(0);
            });
        });

        describe('when Gulltown is in play', function () {
            beforeEach(function () {
                this.player1.clickCard(this.gulltown);
            });

            it('the number of plots in the used pile should be 1', function () {
                expect(this.gulltown.location).toBe('play area');
                expect(this.player1Object.getNumberOfUsedPlots()).toBe(1);
                expect(this.player2Object.getNumberOfUsedPlots()).toBe(1);
                expect(this.player1Object.getNumberOfUsedPlotsByTrait('City')).toBe(1);
                expect(this.player1Object.getNumberOfUsedPlotsByTrait('Summer')).toBe(0);
            });
        });

        describe('when Gulltown and Ricasso with 1 gold are in play', function () {
            beforeEach(function () {
                this.player1.clickCard(this.gulltown);
                this.player1.dragCard(this.ricasso, 'play area');
                this.player1.clickPrompt('1');
            });

            it('the number of plots in the used pile should be 2', function () {
                expect(this.player1Object.getNumberOfUsedPlots()).toBe(2);
                expect(this.player2Object.getNumberOfUsedPlots()).toBe(1);
                expect(this.player1Object.getNumberOfUsedPlotsByTrait('City')).toBe(1);
                expect(this.player1Object.getNumberOfUsedPlotsByTrait('Summer')).toBe(0);
                expect(Array.from(this.player1Object.getTraitsOfUsedPlots()).length).toBe(1);
                expect(Array.from(this.player1Object.getTraitsOfUsedPlots())).toContain('city');
            });
        });

        describe('when Gulltown and Ricasso with 1 gold are in play and 1 real city plot is in the used pile', function () {
            beforeEach(function () {
                this.player1.clickCard(this.gulltown);
                this.player1.dragCard(this.ricasso, 'play area');
                this.player1.clickPrompt('1');
                this.completeMarshalPhase();
                this.completeChallengesPhase();
                this.player2.clickPrompt('Done');
                this.player1.selectPlot('Marching Orders');
                this.player2.selectPlot('Marching Orders');
                this.selectFirstPlayer(this.player1);
            });

            it('the number of plots in the used pile should be 3', function () {
                expect(this.player1Object.getNumberOfUsedPlots()).toBe(3);
                expect(this.player1Object.getNumberOfUsedPlotsByTrait('City')).toBe(2);
                expect(this.player1Object.getNumberOfUsedPlotsByTrait('Summer')).toBe(0);
                expect(Array.from(this.player1Object.getTraitsOfUsedPlots()).length).toBe(2);
                expect(Array.from(this.player1Object.getTraitsOfUsedPlots())).toContain('city');
                expect(Array.from(this.player1Object.getTraitsOfUsedPlots())).toContain('kingdom');
            });
        });
    });
});
