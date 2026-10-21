describe('Summer', function () {
    describe('when Summer enters play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Summer (Core)'],
                    discard: ['Bran Stark (Core)', 'Hedge Knight', 'Ghost (ChoS)'],
                    deadPile: ['Arya Stark (Core)', 'Robb Stark (Core)']
                },
                player2: {
                    discard: ['Tumblestone Knight']
                }
            });

            this.player1.clickCard(this.summer);
            this.player1.triggerAbility(this.summer);
        });

        it('can choose a [stark] character with printed STR 2 or lower in your discard or dead pile', function () {
            expect(this.player1).toBeAbleToSelect(this.branStark);
            expect(this.player1).toBeAbleToSelect(this.aryaStark);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.ghost);
            expect(this.player1).not.toBeAbleToSelect(this.robbStark);
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.summer);

            this.player1.clickCard(this.branStark);

            expect(this.player1).isReadyToTakeAction();
        });

        it('returns a character from your discard pile to your hand', function () {
            this.player1.clickCard(this.branStark);

            expect(this.branStark.location).toBe('hand');
            expect(this.aryaStark.location).toBe('dead pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Summer and returns Bran Stark from their discard pile to their hand'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('returns a character from your dead pile to your hand', function () {
            this.player1.clickCard(this.aryaStark);

            expect(this.aryaStark.location).toBe('hand');
            expect(this.branStark.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you control Bran Stark', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Summer (Core)', 'Bran Stark (Core)', 'Tumblestone Knight']
                },
                player2: {
                    inPlay: ['Bran Stark (OR)']
                }
            });

            this.opponentBran = this.player2.findCardByName('Bran Stark', 'play area');
        });

        it('gives him insight', function () {
            expect(this.branStark.hasKeyword('insight')).toBe(true);
            expect(this.tumblestoneKnight.hasKeyword('insight')).toBe(false);
            expect(this.opponentBran.hasKeyword('insight')).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
