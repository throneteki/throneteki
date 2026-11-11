describe('No Surprises', function () {
    describe('with at least 1 other card in hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    hand: ['No Surprises', 'Tumblestone Knight'],
                    shadows: ['Bolton Flayer']
                },
                player2: {
                    hand: ['Tithe'],
                    shadows: ['House Umber Berserkers'],
                    inPlay: ['House Maester']
                }
            });

            this.player1.clickCard(this.noSurprises);
        });

        it('reveals your hand', function () {
            expect(this.game.getPlainTextLog()).toContain(
                'player1 reveals Tumblestone Knight from their hand'
            );
            expect(this.noSurprises.location).toBe('discard pile');
            expect(this.player2).not.toHavePromptButton('Done');
            expect(this.player1).isReadyToTakeAction();
        });

        it('stops each opponent playing events or bringing cards out of shadows', function () {
            this.player1.clickPrompt('Done');

            expect(this.player2.actionUnavailableReason(this.tithe)).toBe('cost');

            this.player2.clickCard(this.tithe);
            this.player2.clickCard(this.houseUmberBerserkers);

            expect(this.tithe.location).toBe('hand');
            expect(this.houseUmberBerserkers.location).toBe('shadows');
            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not stop you bringing cards out of shadows', function () {
            this.player1.clickCard(this.boltonFlayer);

            expect(this.boltonFlayer.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('lasts until the end of the phase', function () {
            this.completeMarshalPhase();

            expect(this.player2Object.canPlay(this.tithe)).toBe(true);
            expect(this.player2Object.canPutIntoPlay(this.houseUmberBerserkers)).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with no other cards in hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    hand: ['No Surprises']
                }
            });
        });

        it('cannot be played', function () {
            expect(this.player1.actionUnavailableReason(this.noSurprises)).toBe('condition');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
