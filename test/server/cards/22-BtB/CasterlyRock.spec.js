describe('Casterly Rock (BtB)', function () {
    describe('while it is standing', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Casterly Rock (BtB)', 'Lannisport Merchant', 'Burned Men'] }
            });
            this.player1.clickMenu(this.casterlyRock, 'Select cards to gain gold');
            this.player1.clickCard(this.lannisportMerchant);
            this.player1.clickCard(this.burnedMen);
            this.player1.clickPrompt('Done');
        });

        it('kneels to have up to 3 cards gain 1 gold each', function () {
            expect(this.lannisportMerchant.gold).toBe(1);
            expect(this.burnedMen.gold).toBe(1);
            expect(this.casterlyRock.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('before it kneels', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Casterly Rock (BtB)', { card: 'Lannisport Merchant', gold: 2 }]
                }
            });
        });

        it('lets you spend gold on lannister cards you control', function () {
            expect(this.player1Object.getSpendableGold({ activePlayer: this.player1Object })).toBe(
                this.player1Object.gold + 2
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
