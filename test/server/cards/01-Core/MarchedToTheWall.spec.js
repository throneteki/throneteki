describe('Marched to the Wall', function () {
    describe('when each player controls a character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['Marched to the Wall'],
                    inPlay: ['Tumblestone Knight', 'Winterfell Steward']
                },
                player2: {
                    plotDeck: ['A Song of Summer'],
                    inPlay: [{ card: 'Hedge Knight', dupes: 1 }, 'House Dayne Knight']
                }
            });

            this.player1.selectPlot(this.marchedToTheWall);
            this.player2.selectPlot(this.aSongOfSummer);
            this.selectFirstPlayer(this.player1);
        });

        it('has each player choose a character they control', function () {
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);

            this.player1.clickCard(this.tumblestoneKnight);
            this.player2.clickCard(this.hedgeKnight);

            expect(this.player1).isReadyToTakeAction();
        });

        it('discards the chosen characters, which cannot be saved', function () {
            this.player1.clickCard(this.winterfellSteward);
            this.player2.clickCard(this.hedgeKnight);

            expect(this.winterfellSteward.location).toBe('discard pile');
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.houseDayneKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a player controls no characters', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['Marched to the Wall'] },
                player2: { plotDeck: ['A Song of Summer'], inPlay: ['Hedge Knight'] }
            });

            this.player1.selectPlot(this.marchedToTheWall);
            this.player2.selectPlot(this.aSongOfSummer);
            this.selectFirstPlayer(this.player1);
        });

        it('only has the other player discard a character', function () {
            this.player2.clickCard(this.hedgeKnight);

            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
