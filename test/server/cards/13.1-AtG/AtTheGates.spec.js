describe('At The Gates', function () {
    integration(function () {
        describe('vs Varys Riddle + Gates of the Moon', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'At the Gates',
                    "Varys's Riddle",
                    'Gates of the Moon'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.gates1 = this.player1.findCardByName('Gates of the Moon');
                this.gates2 = this.player2.findCardByName('Gates of the Moon');

                this.completeSetup();

                // Draw the Gates back into the deck
                this.player1.dragCard(this.gates1, 'draw deck');
                this.player2.dragCard(this.gates2, 'draw deck');

                this.player1.selectPlot('At the Gates');
                this.player2.selectPlot("Varys's Riddle");
                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player1.clickCard(this.gates1);

                this.player2.clickCard(this.gates2);
            });

            it('modifies income correctly', function () {
                expect(this.player1Object.getIncome()).toBe(7);
                expect(this.player2Object.getIncome()).toBe(8);
            });
        });

        describe('w/ Pulling the Strings', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'At the Gates',
                    'Pulling the Strings',
                    'A Noble Cause',
                    'City of Spiders',
                    'Gates of the Moon'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.limitedCard = this.player1.findCardByName('Gates of the Moon');

                this.atTheGates = this.player2.findCardByName('At the Gates');

                this.completeSetup();

                // Draw the limited card back into the deck
                this.player1.dragCard(this.limitedCard, 'draw deck');

                // Drag At The Gates to used pile to be copied
                this.player2.dragCard(this.atTheGates, 'revealed plots');
            });

            describe('when there is no City plot in your used pile', function () {
                beforeEach(function () {
                    this.player1.selectPlot('Pulling the Strings');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.player1.clickCard(this.atTheGates);

                    this.player1.clickCard(this.limitedCard);
                });

                it('puts the card into play', function () {
                    expect(this.limitedCard.location).toBe('play area');
                });
            });

            describe('when there is a City plot in your used pile', function () {
                beforeEach(function () {
                    const ownCityPlot = this.player1.findCardByName('City of Spiders');
                    this.player1.dragCard(ownCityPlot, 'revealed plots');

                    this.player1.selectPlot('Pulling the Strings');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.player1.clickCard(this.atTheGates);

                    this.player1.clickCard(this.limitedCard);
                });

                it('puts the card into hand', function () {
                    expect(this.limitedCard.location).toBe('hand');
                });
            });
        });
    });
});
