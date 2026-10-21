describe('Umber Loyalist', function () {
    describe('when it enters play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    gold: 3,
                    hand: ['Umber Loyalist']
                }
            });

            this.player1.clickCard(this.umberLoyalist);
        });

        it('draws 2 cards', function () {
            this.player1.triggerAbility(this.umberLoyalist);

            expect(this.player1Object.hand).toHaveLength(2);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Umber Loyalist and draws 2 cards'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when it leaves play', function () {
        function killLoyalist(context, hand) {
            context.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    faction: 'stark',
                    hand,
                    inPlay: ['Umber Loyalist']
                },
                player2: {
                    inPlay: ['Bastard in Hiding']
                }
            });

            context.unopposedChallenge(context.player2, 'Military', context.bastardInHiding);
            context.player1.clickCard(context.umberLoyalist);
        }

        it('makes you choose and discard 2 cards from your hand', function () {
            killLoyalist(this, ['Hedge Knight', 'Tumblestone Knight', 'House Maester']);

            expect(this.player1).toHavePrompt('Select 2 cards to discard');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Done');

            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.tumblestoneKnight.location).toBe('discard pile');
            expect(this.houseMaester.location).toBe('hand');
            expect(this.umberLoyalist.location).toBe('dead pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 is forced by Umber Loyalist to choose and discard 2 cards from their hand'
            );
        });

        it('discards as many as it can when you have fewer than 2 cards', function () {
            killLoyalist(this, ['Hedge Knight']);

            expect(this.player1).toHavePrompt('Select 2 cards to discard');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');

            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.umberLoyalist.location).toBe('dead pile');
        });
    });
});
