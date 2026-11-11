describe('Steward at the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                gold: 10,
                hand: ['House Maester', 'Sworn Brother'],
                inPlay: ['Steward at the Wall']
            }
        });

        this.player1.clickCard(this.stewardAtTheWall);
    });

    it('kneels to reduce the cost of the next [thenightswatch] character you marshal this phase by 1', function () {
        expect(this.stewardAtTheWall.kneeled).toBe(true);

        this.player1.clickCard(this.houseMaester);

        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.swornBrother);

        expect(this.swornBrother.location).toBe('play area');
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
