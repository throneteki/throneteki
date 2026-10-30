describe('Arya Stark (Core)', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Arya Stark (Core)'],
                    drawDeck: ['Hedge Knight']
                }
            });

            this.player1.clickCard(this.aryaStark);
        });

        it('places the top card of the deck on her facedown as a duplicate', function () {
            this.player1.triggerAbility(this.aryaStark);

            expect(this.aryaStark.dupes).toContain(this.hedgeKnight);
            expect(this.hedgeKnight.facedown).toBe(true);
            expect(this.aryaStark.hasIcon('military')).toBe(true);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Arya Stark and places a facedown card on Arya Stark as a duplicate'
            );
            expect(this.game.getPlainTextLog()).not.toContain('Hedge Knight');
            expect(this.player1).isReadyToTakeAction();
        });

        it('has no [military] icon without a duplicate', function () {
            this.player1.clickPrompt('Pass');

            expect(this.aryaStark.dupes).toHaveLength(0);
            expect(this.aryaStark.hasIcon('military')).toBe(false);
            expect(this.hedgeKnight.location).toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('with a duplicate from hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [{ card: 'Arya Stark (Core)', dupes: 1 }]
                }
            });
        });

        it('has a [military] icon', function () {
            expect(this.aryaStark.dupes).toHaveLength(1);
            expect(this.aryaStark.hasIcon('military')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when she enters play under an opponent of her owner', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    plot: 'A Feast for Crows',
                    discard: ['Arya Stark (Core)']
                },
                player2: {
                    faction: 'thenightswatch',
                    hand: ['Night Gathers...']
                }
            });

            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.nightGathers);
            this.player2.clickCard(this.aryaStark);
        });

        it('cannot be triggered, because she cannot be duplicated', function () {
            expect(this.aryaStark.controller).toBe(this.player2Object);
            expect(this.player2).not.toAllowAbilityTrigger(this.aryaStark);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
