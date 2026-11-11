describe('Maester Gormon', function () {
    describe('when the top card of your deck is not [tyrell]', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'tyrell',
                    inPlay: ['Maester Gormon'],
                    drawDeck: ['Hedge Knight', 'Nightmares']
                },
                player2: {
                    inPlay: ['Bastard in Hiding']
                }
            });
        });

        it('lets you look at the top card of your deck', function () {
            expect(this.game.isCardVisible(this.hedgeKnight, this.player1Object)).toBe(true);
            expect(this.game.isCardVisible(this.nightmares, this.player1Object)).toBe(false);
            expect(this.game.isCardVisible(this.hedgeKnight, this.player2Object)).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets you marshal it, once per phase', function () {
            this.player1.clickCard(this.hedgeKnight);

            expect(this.hedgeKnight.location).toBe('play area');
            expect(this.player1Object.gold).toBe(3);

            this.player1.clickCard(this.nightmares);

            expect(this.nightmares.location).toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets you play it in a later phase', function () {
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.clickCard(this.nightmares);
            this.player1.clickCard(this.bastardInHiding);

            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the top card of your deck is [tyrell]', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'tyrell',
                    inPlay: ['Maester Gormon'],
                    drawDeck: ['Courtesan of the Rose']
                }
            });

            this.player1.clickCard(this.courtesanOfTheRose);
        });

        it('does not let you marshal it', function () {
            expect(this.courtesanOfTheRose.location).toBe('draw deck');
            expect(this.player1Object.gold).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
