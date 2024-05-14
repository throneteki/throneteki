describe('The King in the North', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('lannister', [
                'The King in the North (R)',
                'Renly Baratheon (FotS)',
                'Dornish Fiefdom',
                'Hedge Knight',
                'Tithe',
                'Old Forest Hunter'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.king = this.player1.findCardByName('Renly Baratheon', 'hand');
            this.location = this.player1.findCardByName('Dornish Fiefdom', 'hand');
            this.neutral = this.player1.findCardByName('Hedge Knight', 'hand');
            this.event = this.player1.findCardByName('Tithe', 'hand');
            this.nonKing = this.player1.findCardByName('Old Forest Hunter', 'hand');

            this.player1.clickCard(this.location);
            this.player1.clickCard(this.neutral);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

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

        describe('when you trigger a non-king/queen character ability', function () {
            beforeEach(function () {
                this.player1.clickCard(this.nonKing);
                this.player1.clickMenu(this.nonKing, 'Discard a card to gain 1 gold');
            });

            it('should not resolve', function () {
                expect(this.player1).toHavePrompt('Marshal your cards');
                expect(this.player1Object.gold).toBe(3);
            });
        });

        describe('when you trigger a king ability', function () {
            beforeEach(function () {
                this.player1.clickCard(this.king);
                this.player1.clickMenu(this.king, 'Put character into play');
            });

            it('should resolve as usual', function () {
                this.player1.clickCard(this.nonKing);
                expect(this.nonKing.location).toBe('play area');
            });
        });
    });
});
