describe('Archmaester Marwyn', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Fealty',
                gold: 10,
                hand: ['Archmaester Marwyn'],
                drawDeck: ['Hedge Knight', 'Nightmares']
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });

        this.player1.clickCard(this.archmaesterMarwyn);
    });

    describe('when he enters play', function () {
        beforeEach(function () {
            this.player1.triggerAbility(this.archmaesterMarwyn);
        });

        it('places the top 2 cards of your deck facedown under your agenda', function () {
            expect(this.fealty.underneath).toEqual(
                expect.arrayContaining([this.hedgeKnight, this.nightmares])
            );
            expect(this.hedgeKnight.facedown).toBe(true);
            expect(this.nightmares.facedown).toBe(true);
            expect(this.game.isCardVisible(this.hedgeKnight, this.player1Object)).toBe(true);
            expect(this.game.isCardVisible(this.hedgeKnight, this.player2Object)).toBe(false);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Archmaester Marwyn to place top 2 cards of their deck facedown under their agenda'
            );
            expect(this.game.getPlainTextLog()).not.toContain('Hedge Knight');
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets you marshal a card from under your agenda once per phase', function () {
            this.player1.clickCard(this.hedgeKnight);

            expect(this.hedgeKnight.location).toBe('play area');
            expect(this.player1Object.gold).toBe(3);

            this.player1.clickCard(this.nightmares);

            expect(this.nightmares.location).toBe('underneath');
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets you play a card from under your agenda in a later phase', function () {
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.clickCard(this.nightmares);
            this.player1.clickCard(this.bastardInHiding);

            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
