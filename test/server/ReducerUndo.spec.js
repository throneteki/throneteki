describe('clicking a used cost reducer again', function () {
    describe('when its cost can be refunded', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    gold: 5,
                    inPlay: ['Maester Kedry'],
                    hand: ['Nightmares']
                },
                player2: {
                    inPlay: ['Hedge Knight']
                }
            });

            this.player1.clickCard(this.maesterKedry);
            this.player1.clickCard(this.maesterKedry);
        });

        it('stands it and ends its reduction', function () {
            expect(this.maesterKedry.kneeled).toBe(false);

            this.player1.clickCard(this.nightmares);
            this.player1.clickCard(this.hedgeKnight);

            expect(this.player1Object.gold).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when its effect cannot be taken back', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    gold: 4,
                    inPlay: [{ card: 'Sansa Stark (WotN)', attachments: ['Queen of Meereen'] }],
                    hand: ['The Roseroad', 'Hedge Knight']
                }
            });

            this.player1.clickCard(this.queenOfMeereen);
            this.player1.clickCard(this.theRoseroad);
            this.player1.clickPrompt('Done');
        });

        it('leaves it used', function () {
            const [action] = this.queenOfMeereen.abilities.actions;
            expect(action.deactivate(this.player1.player)).toBe(false);
            expect(this.queenOfMeereen.kneeled).toBe(true);
            expect(this.theRoseroad.location).toBe('discard pile');

            this.player1.clickCard(this.hedgeKnight);

            expect(this.player1Object.gold).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
