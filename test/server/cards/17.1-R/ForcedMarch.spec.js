describe('Forced March', function () {
    integration(function () {
        describe('when revealed', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'Forced March (R)',
                    'A Noble Cause',
                    'Hedge Knight',
                    'Hedge Knight',
                    'Hedge Knight',
                    'Winterfell Steward',
                    'Ygritte'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                [this.char1, this.char2, this.char3] =
                    this.player1.filterCardsByName('Hedge Knight');
                [this.char4] = this.player1.filterCardsByName('Winterfell Steward');
                [this.ygritte] = this.player1.filterCardsByName('Ygritte');
                [this.opponentChar1, this.opponentChar2, this.opponentChar3] =
                    this.player2.filterCardsByName('Hedge Knight');
                [this.opponentChar4] = this.player2.filterCardsByName('Winterfell Steward');
                [this.opponentYgritte] = this.player2.filterCardsByName('Ygritte');

                this.game.addGold(this.player1Object, 3);
                this.player1.clickCard(this.char1);
                this.player1.clickCard(this.char2);
                this.player1.clickCard(this.char3);
                this.player1.clickCard(this.char4);
                this.player1.clickCard(this.ygritte);
                this.game.addGold(this.player2Object, 3);
                this.player2.clickCard(this.opponentChar1);
                this.player2.clickCard(this.opponentChar2);
                this.player2.clickCard(this.opponentChar3);
                this.player2.clickCard(this.opponentChar4);
                this.player2.clickCard(this.opponentYgritte);

                this.completeSetup();

                this.player1.selectPlot('Forced March');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);
            });

            it('lets you select characters you control with military icons to kneel', function () {
                expect(this.player1).toHavePrompt('Select characters');
                this.player1.clickCard(this.char1);
                this.player1.clickCard(this.char2);
                this.player1.clickPrompt('Done');
                expect(this.char1.kneeled).toBe(true);
                expect(this.char2.kneeled).toBe(true);
                expect(this.char3.kneeled).toBe(false);
                expect(this.char4.kneeled).toBe(false);
                expect(this.ygritte.kneeled).toBe(false);
            });

            it('as many kneelable characters the opponent controls are knelt', function () {
                this.player1.clickCard(this.char1);
                this.player1.clickCard(this.char2);
                this.player1.clickPrompt('Done');
                expect(this.player2).toHavePrompt('Select 2 characters');
                this.player2.clickCard(this.opponentChar1);
                this.player2.clickCard(this.opponentChar2);
                this.player2.clickPrompt('Done');
                expect(this.opponentChar1.kneeled).toBe(true);
                expect(this.opponentChar2.kneeled).toBe(true);
                expect(this.opponentChar3.kneeled).toBe(false);
                expect(this.opponentChar4.kneeled).toBe(false);
                expect(this.opponentYgritte.kneeled).toBe(false);
            });
        });
    });
});
