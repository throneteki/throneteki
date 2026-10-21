describe('Targaryen Loyalist', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'Viserion (Core)'],
                inPlay: ['Targaryen Loyalist']
            }
        });

        this.player1.clickCard(this.targaryenLoyalist);
    });

    it('kneels to reduce the cost of the next [targaryen] character you marshal this phase by 1', function () {
        expect(this.targaryenLoyalist.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.viserion);

        expect(this.viserion.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
