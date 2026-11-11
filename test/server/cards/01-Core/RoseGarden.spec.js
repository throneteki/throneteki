describe('Rose Garden', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'Courtesan of the Rose'],
                inPlay: ['Rose Garden']
            }
        });

        this.player1.clickCard(this.roseGarden);
    });

    it('kneels to reduce the cost of the next [tyrell] card you marshal this phase by 1', function () {
        expect(this.roseGarden.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.courtesanOfTheRose);

        expect(this.courtesanOfTheRose.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
