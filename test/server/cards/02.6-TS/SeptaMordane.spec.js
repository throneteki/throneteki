describe('Septa Mordane', function () {
    describe('while you control Sansa Stark and Arya Stark', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    inPlay: ['Septa Mordane', 'Sansa Stark (WotN)', 'Arya Stark (Core)']
                }
            });
        });

        it('gains +2 STR and renown herself, rather than Sansa Stark', function () {
            expect(this.septaMordane.getStrength()).toBe(5);
            expect(this.septaMordane.hasKeyword('Renown')).toBe(true);
            expect(this.sansaStark.getStrength()).toBe(4);
            expect(this.sansaStark.hasKeyword('Renown')).toBe(false);
            expect(this.aryaStark.hasIcon('intrigue')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you control neither', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    inPlay: ['Septa Mordane']
                }
            });
        });

        it('does not gain STR or renown', function () {
            expect(this.septaMordane.getStrength()).toBe(3);
            expect(this.septaMordane.hasKeyword('Renown')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("when an opponent's plot would choose her", function () {
        function setup(context, player1InPlay) {
            context.setupTest({
                phase: 'plot',
                player1: {
                    plotDeck: ['A Song of Summer'],
                    inPlay: player1InPlay
                },
                player2: {
                    plotDeck: ['Marched to the Wall'],
                    inPlay: ['House Dayne Knight']
                }
            });

            context.player1.selectPlot(context.aSongOfSummer);
            context.player2.selectPlot(context.marchedToTheWall);
            context.selectFirstPlayer(context.player1);
        }

        it('is immune while you control Arya Stark', function () {
            setup(this, ['Septa Mordane', 'Arya Stark (Core)']);

            expect(this.player1).not.toBeAbleToSelect(this.septaMordane);
            expect(this.player1).toBeAbleToSelect(this.aryaStark);

            this.player1.clickCard(this.aryaStark);
            this.player2.clickCard(this.houseDayneKnight);

            expect(this.aryaStark.location).toBe('discard pile');
            expect(this.septaMordane.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('is not immune while you do not control Arya Stark', function () {
            setup(this, ['Septa Mordane', 'Sansa Stark (WotN)']);

            expect(this.player1).toBeAbleToSelect(this.septaMordane);

            this.player1.clickCard(this.septaMordane);
            this.player2.clickCard(this.houseDayneKnight);

            expect(this.septaMordane.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
