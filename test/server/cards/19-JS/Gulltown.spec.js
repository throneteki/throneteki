describe('Gulltown', function () {
    describe('while in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Gulltown (JS)']
                }
            });
        });

        it('counts 1 additional City plot for each player, and gives you +1 income', function () {
            expect(this.player1Object.getNumberOfUsedPlots()).toBe(1);
            expect(this.player2Object.getNumberOfUsedPlots()).toBe(1);
            expect(this.player1Object.getNumberOfUsedPlotsByTrait('City')).toBe(1);
            expect(this.player2Object.getNumberOfUsedPlotsByTrait('City')).toBe(1);
            expect(this.player1Object.getNumberOfUsedPlotsByTrait('Summer')).toBe(0);
            expect(this.player1Object.getIncome()).toBe(6);
            expect(this.player2Object.getIncome()).toBe(5);
            expect(this.player1Object.gold).toBe(6);

            this.player1.clickPrompt('Done');

            expect(this.player2Object.gold).toBe(5);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('while not in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Gulltown (JS)']
                }
            });
        });

        it('does not change used plots or income', function () {
            expect(this.player1Object.getNumberOfUsedPlots()).toBe(0);
            expect(this.player2Object.getNumberOfUsedPlots()).toBe(0);
            expect(this.player1Object.getIncome()).toBe(5);
            expect(this.player2Object.getIncome()).toBe(5);
            expect(this.player1Object.gold).toBe(5);

            this.player1.clickPrompt('Done');

            expect(this.player2Object.gold).toBe(5);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
