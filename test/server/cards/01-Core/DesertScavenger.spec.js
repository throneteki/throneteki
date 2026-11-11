describe('Desert Scavenger', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'House Dayne Knight'],
                inPlay: ['Desert Scavenger']
            }
        });

        this.player1.clickCard(this.desertScavenger);
    });

    it('kneels to reduce the cost of the next [martell] character you marshal this phase by 1', function () {
        expect(this.desertScavenger.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.houseDayneKnight);

        expect(this.houseDayneKnight.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
