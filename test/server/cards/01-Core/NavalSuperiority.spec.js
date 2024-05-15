describe('Naval Superiority', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('lannister', [
                'Naval Superiority',
                'A Noble Cause',
                'A Feast for Crows',
                'A Clash of Kings',
                'The Roseroad',
                'Littlefinger (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.player2.clickCard('The Roseroad', 'hand');
            this.player2.clickCard('Littlefinger', 'hand');

            this.completeSetup();
        });

        describe('vs a Kingdom plot', function () {
            beforeEach(function () {
                this.player1.selectPlot('Naval Superiority');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);
            });

            it('should treat the base gold value as 0', function () {
                // 0 from plot, 1 from Littlefinger, 1 from Roseroad
                expect(this.player2Object.gold).toBe(2);
            });
        });

        describe('vs a Edict plot', function () {
            beforeEach(function () {
                this.player1.selectPlot('Naval Superiority');
                this.player2.selectPlot('A Feast for Crows');
                this.selectFirstPlayer(this.player2);
            });

            it('should treat the base gold value as 0', function () {
                // 0 from plot, 1 from Littlefinger, 1 from Roseroad
                expect(this.player2Object.gold).toBe(2);
            });
        });

        describe('vs a normal plot', function () {
            beforeEach(function () {
                this.player1.selectPlot('Naval Superiority');
                this.player2.selectPlot('A Clash of Kings');
                this.selectFirstPlayer(this.player2);
            });

            it('should not modify the base gold value', function () {
                // 4 from plot, 1 from Littlefinger, 1 from Roseroad
                expect(this.player2Object.gold).toBe(6);
            });
        });
    });
});
