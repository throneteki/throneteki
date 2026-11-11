describe('Iron Islands Fishmonger', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'Salty Navigator'],
                inPlay: ['Iron Islands Fishmonger']
            }
        });

        this.player1.clickCard(this.ironIslandsFishmonger);
    });

    it('kneels to reduce the cost of the next [greyjoy] character you marshal this phase by 1', function () {
        expect(this.ironIslandsFishmonger.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.saltyNavigator);

        expect(this.saltyNavigator.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
