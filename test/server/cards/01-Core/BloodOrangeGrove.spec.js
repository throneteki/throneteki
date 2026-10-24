describe('Blood Orange Grove', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'House Dayne Knight'],
                inPlay: ['Blood Orange Grove']
            }
        });

        this.player1.clickCard(this.bloodOrangeGrove);
    });

    it('kneels to reduce the cost of the next [martell] card you marshal this phase by 1', function () {
        expect(this.bloodOrangeGrove.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.houseDayneKnight);

        expect(this.houseDayneKnight.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
