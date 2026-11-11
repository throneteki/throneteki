describe('Secret Schemes (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Secret Schemes (R2)'],
                usedPlots: [
                    'A Noble Cause',
                    'Sneak Attack',
                    'A Clash of Kings',
                    'Trading with the Pentoshi',
                    'Famine',
                    'Rationing'
                ]
            }
        });
        this.handSize = this.player1Object.hand.length;
        this.player1.clickCard(this.secretSchemes);
    });

    it('draws at most 5 cards', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1Object.hand.length).toBe(this.handSize - 1 + 5);
        expect(this.player1).isReadyToTakeAction();
    });
});
