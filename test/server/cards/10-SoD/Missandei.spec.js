describe('Missandei', function () {
    describe('when she is discarded from your hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    faction: 'targaryen',
                    hand: ['Missandei']
                },
                player2: {
                    inPlay: ["Ser Gregor's Marauders"]
                }
            });

            this.unopposedChallenge(this.player2, 'Intrigue', this.serGregorsMarauders);
        });

        it('puts her into play instead', function () {
            this.player1.triggerAbility(this.missandei);

            expect(this.missandei.location).toBe('play area');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Missandei to put Missandei into play instead of placing it in their discard pile'
            );
            expect(this.player2).isReadyToTakeAction();
        });

        it('can be declined', function () {
            this.player1.clickPrompt('Pass');

            expect(this.missandei.location).toBe('discard pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when she is discarded from your deck', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    faction: 'targaryen',
                    drawDeck: ['Missandei']
                },
                player2: {
                    inPlay: ["Ser Gregor's Marauders"]
                }
            });

            this.unopposedChallenge(this.player2, 'Military', this.serGregorsMarauders);
        });

        it('puts her into play instead', function () {
            this.player1.triggerAbility(this.missandei);

            expect(this.missandei.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
