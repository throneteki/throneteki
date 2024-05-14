describe('The King in the North', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('lannister', [
                'The King in the North (FotOG)',
                'Tommen Baratheon',
                'Dornish Fiefdom',
                'Hedge Knight',
                'Tithe'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.king = this.player1.findCardByName('Tommen Baratheon', 'hand');
            this.location = this.player1.findCardByName('Dornish Fiefdom', 'hand');
            this.neutral = this.player1.findCardByName('Hedge Knight', 'hand');
            this.event = this.player1.findCardByName('Tithe', 'hand');

            this.location2 = this.player2.findCardByName('Dornish Fiefdom', 'hand');

            this.player1.clickCard(this.location);
            this.player1.clickCard(this.neutral);

            this.player2.clickCard(this.location2);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe("when you don't control a King character", function () {
            describe('when you trigger a location ability', function () {
                beforeEach(function () {
                    this.player1.clickMenu(this.location, 'Gain gold');
                });

                it('should not resolve', function () {
                    expect(this.player1Object.gold).toBe(5);
                });
            });

            describe('when you trigger an event ability', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.event);
                    this.player1.clickCard(this.neutral);
                });

                it('should resolve as usual', function () {
                    expect(this.player1Object.gold).toBe(7);
                });
            });
        });

        describe("when your opponent doesn't control a King character", function () {
            describe('when they trigger a location ability', function () {
                beforeEach(function () {
                    this.player2.clickMenu(this.location2, 'Gain gold');
                });

                it('should not resolve', function () {
                    expect(this.player2Object.gold).toBe(0);
                });
            });
        });

        describe('when you control a King character', function () {
            beforeEach(function () {
                this.player1.clickCard(this.king);
            });

            describe('when you trigger a location ability', function () {
                beforeEach(function () {
                    this.player1.clickMenu(this.location, 'Gain gold');
                });

                it('should resolve as usual', function () {
                    expect(this.player1Object.gold).toBe(4);
                });
            });
        });
    });
});
