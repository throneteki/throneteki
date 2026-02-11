describe('Loot', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', [
                'A Noble Cause',
                "Littlefinger's Meddling (R)",
                'Hedge Knight',
                'Loot'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'A Noble Cause',
                { name: 'Hedge Knight', count: 60 }
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Hedge Knight', 'hand');
            this.completeSetup();
        });

        describe('when played normally', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'Military', 'Hedge Knight');
                this.player1.triggerAbility('Loot');
                this.player1.selectValue('5');
                // Select order of discarded cards
                this.player2.clickPrompt('Done');
            });

            it('uses the opponents gold', function () {
                expect(this.player1Object.gold).toBe(this.player1Object.activePlot.getIncome());
                expect(this.player2Object.gold).toBe(0);
                expect(this.player2Object.discardPile.length).toBe(5);
            });
        });

        describe('when played with cost reducer', function () {
            beforeEach(function () {
                this.player1.selectPlot("Littlefinger's Meddling");
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'Military', 'Hedge Knight');
                this.player1.triggerAbility('Loot');
                this.player1.selectValue('6');
                // Select order of discarded cards
                this.player2.clickPrompt('Done');
            });

            it('uses the opponents gold and discards the right amount', function () {
                expect(this.player1Object.gold).toBe(this.player1Object.activePlot.getIncome());
                expect(this.player2Object.gold).toBe(1); // X = 6, minus 2 reduction from Littlefinger's Meddling
                expect(this.player2Object.discardPile.length).toBe(6);
            });
        });
    });
});
