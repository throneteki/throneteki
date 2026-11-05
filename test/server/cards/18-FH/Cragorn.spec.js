describe('Cragorn', function () {
    describe('during a challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        { card: 'Cragorn (FH)', gold: 1 },
                        { card: 'House Maester', gold: 1 },
                        'Stony Shore Raider'
                    ],
                    drawDeck: [
                        'Throwing Axe',
                        'Little Bird (Core)',
                        'Crown of Gold (R)',
                        'Hedge Knight'
                    ]
                },
                player2: {
                    inPlay: [{ card: 'Stony Shore Raider', gold: 1 }]
                }
            });

            this.raider = this.player1.findCardByName('Stony Shore Raider', 'play area');
            this.opponentRaider = this.player2.findCardByName('Stony Shore Raider', 'play area');
        });

        it('discards gold from a Raider you control and puts a matching attachment into play', function () {
            this.player1.clickMenu(this.cragorn, 'Search top 10 cards');

            expect(this.player1).toHavePrompt('Select card to discard 1 gold');
            expect(this.player1).toBeAbleToSelect(this.cragorn);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
            expect(this.player1).not.toBeAbleToSelect(this.raider);
            expect(this.player1).not.toBeAbleToSelect(this.opponentRaider);
            this.player1.clickCard(this.cragorn);

            expect(this.player1).toBeAbleToSelect(this.throwingAxe);
            expect(this.player1).not.toBeAbleToSelect(this.littleBird);
            expect(this.player1).not.toBeAbleToSelect(this.crownOfGold);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
            this.player1.clickCard(this.throwingAxe);

            expect(this.player1).toBeAbleToSelect(this.raider);
            expect(this.player1).toBeAbleToSelect(this.opponentRaider);
            expect(this.player1).not.toBeAbleToSelect(this.cragorn);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
            this.player1.clickCard(this.raider);

            expect(this.throwingAxe.parent).toBe(this.raider);
            expect(this.throwingAxe.location).toBe('play area');
            expect(this.cragorn.hasToken('gold')).toBe(false);
            expect(this.houseMaester.tokens.gold).toBe(1);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 discards 1 gold from Cragorn to search the top 10 cards of their deck'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot be used again this phase', function () {
            this.player1.clickMenu(this.cragorn, 'Search top 10 cards');
            this.player1.clickCard(this.cragorn);
            this.player1.clickCard(this.throwingAxe);
            this.player1.clickCard(this.raider);

            expect(this.player1.actionUnavailableReason(this.cragorn)).toBe('limit');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when no Raider you control has gold', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Cragorn (FH)', { card: 'House Maester', gold: 1 }]
                }
            });
        });

        it('cannot pay the cost', function () {
            expect(this.player1.actionUnavailableReason(this.cragorn)).toBe('cost');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('outside the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [{ card: 'Cragorn (FH)', gold: 1 }]
                }
            });
        });

        it('cannot be triggered', function () {
            expect(this.player1.actionUnavailableReason(this.cragorn)).toBe('phase');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
