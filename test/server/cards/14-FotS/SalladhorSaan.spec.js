describe('Salladhor Saan', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Salladhor Saan (FotS)'], hand: ['Wily Smuggler'] },
            player2: { inPlay: ['Casterly Rock (Core)'] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.wilySmuggler);
        this.player1.triggerAbility('Salladhor Saan');
        this.player1.clickCard(this.casterlyRock);
    });

    it("kneels a location, then gains gold equal to that location's printed cost", function () {
        expect(this.casterlyRock.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold - 2 + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
