describe('Lannisport Merchant', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'Grand Maester Pycelle (Core)'],
                inPlay: ['Lannisport Merchant']
            }
        });

        this.player1.clickCard(this.lannisportMerchant);
    });

    it('kneels to reduce the cost of the next [lannister] character you marshal this phase by 1', function () {
        expect(this.lannisportMerchant.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.grandMaesterPycelle);

        expect(this.grandMaesterPycelle.location).toBe('play area');
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
