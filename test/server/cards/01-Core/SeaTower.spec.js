describe('Sea Tower', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'Salty Navigator'],
                inPlay: ['Sea Tower']
            }
        });

        this.player1.clickCard(this.seaTower);
    });

    it('kneels to reduce the cost of the next [greyjoy] card you marshal this phase by 1', function () {
        expect(this.seaTower.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.saltyNavigator);

        expect(this.saltyNavigator.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
