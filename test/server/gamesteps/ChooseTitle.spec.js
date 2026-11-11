describe('melee titles', function () {
    integration({ gameFormat: 'melee' }, function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', ['Trading with the Pentoshi', 'Hedge Knight']);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.player3.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player1);
            this.selectPlotOrder(this.player2);

            this.entered = [];
            this.game.on('onTitlesEnteredPlay', (event) => this.entered.push(event));
        });

        it('keeps each choice secret until the titles enter play together', function () {
            this.player2.selectTitle('Master of Coin');

            const coin = this.game.titlePool.cards.find((card) => card.name === 'Master of Coin');
            expect(this.player2Object.title).toBeFalsy();
            expect(coin.location).toBe('title pool');
            expect(this.entered).toHaveLength(0);
            expect(this.player3).toHavePrompt('Select a title');

            this.player3.selectTitle('Master of Laws');
            this.player1.selectTitle('Master of Ships');

            expect(this.entered).toHaveLength(1);
            expect(this.entered[0].titles.map((card) => card.name)).toEqual([
                'Master of Coin',
                'Master of Laws',
                'Master of Ships'
            ]);
            expect(this.player2Object.title.name).toBe('Master of Coin');
            expect(this.player3Object.title.name).toBe('Master of Laws');
            expect(this.player1Object.title.name).toBe('Master of Ships');
            expect(this.player2Object.title.facedown).toBe(false);
            expect(this.player2Object.title.location).toBe('title');
        });
    });
});
