describe('Winter Maid', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Time of Plenty',
                'Loan from the Iron Bank',
                '"The Winter Maid"'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.wintermaid = this.player1.findCardByName('"The Winter Maid"');
            this.plot = this.player1.findCardByName('Time of Plenty');
            this.completeSetup();
        });

        describe('when there is no summer plot in play during the plot revelation interrupt window', function () {
            beforeEach(function () {
                this.player1.selectPlot('Time of Plenty');
                this.player2.selectPlot('Time of Plenty');
                this.player1.clickCard(this.wintermaid);
                this.player1.clickPrompt('Time of Plenty');
            });

            it('should give the revealed plot the Winter trait', function () {
                expect(this.player1Object.activePlot.hasTrait('Winter')).toBe(true);
            });

            it('should return The Winter Maid back to hand', function () {
                expect(this.wintermaid.location).toBe('hand');
            });
        });

        describe('when there is a summer plot in play during the plot revelation interrupt window', function () {
            beforeEach(function () {
                this.player1.selectPlot('Time of Plenty');
                this.player2.selectPlot('Time of Plenty');
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');
                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();
                this.completeChallengesPhase();
                this.player1.clickCard(this.wintermaid);
                this.player1.clickPrompt('Loan from the Iron Bank');
            });

            it('should give the revealed plot the Winter trait', function () {
                expect(this.player1Object.activePlot.hasTrait('Winter')).toBe(true);
            });

            it('should NOT return The Winter Maid back to hand', function () {
                expect(this.wintermaid.location).toBe('discard pile');
            });
        });
    });
});
