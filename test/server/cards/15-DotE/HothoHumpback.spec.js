describe('Hotho Humpback', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Hotho Humpback'],
                    hand: Array(7).fill('Hedge Knight'),
                    drawDeck: ['Castle Guard']
                },
                player2: { hand: Array(7).fill('Hedge Knight'), drawDeck: ['Castle Guard'] }
            });
            this.player1.clickMenu(this.hothoHumpback, 'Draw card and check reserve');
        });

        it('has each player draw a card and then check reserve', function () {
            expect(this.player1Object.hand.length).toBe(8);
            expect(this.player2Object.hand.length).toBe(8);
            expect(this.player1).toHavePrompt(
                'Select 2 cards to discard down to reserve (top first)'
            );
            expect(this.player2).toHavePrompt('Waiting for opponent to discard down to reserve');
        });
    });

    describe('with a draw restriction in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { inPlay: ['Hotho Humpback', 'The High Sparrow'] },
                player2: { plotDeck: ['Counting Coppers'] }
            });
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Counting Coppers');
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
            this.player1HandSize = this.player1Object.hand.length;
            this.player2HandSize = this.player2Object.hand.length;
            this.player1.clickMenu(this.hothoHumpback, 'Draw card and check reserve');
        });

        it('draws only for players who can still draw and still checks reserve', function () {
            expect(this.player1Object.hand.length).toBe(this.player1HandSize + 1);
            expect(this.player2Object.hand.length).toBe(this.player2HandSize);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
