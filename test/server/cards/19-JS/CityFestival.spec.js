describe('City Festival (JS)', function () {
    function reveal() {
        this.startingGold = this.player1Object.gold;
        this.player1.selectPlot('City Festival');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    }

    describe('with fewer than 2 City plots in your used pile', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'plot', player1: { plotDeck: ['City Festival (JS)'] } });
            reveal.call(this);
        });

        it('gains 3 gold', function () {
            expect(this.player1Object.gold).toBe(this.startingGold + 2 + 3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with 2 City plots in your used pile', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['City Festival (JS)'],
                    usedPlots: ['City of Wealth', 'City Blockade (FUtG)']
                }
            });
            reveal.call(this);
        });

        it('gains 6 gold instead', function () {
            expect(this.player1Object.gold).toBe(this.startingGold + 2 + 6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
