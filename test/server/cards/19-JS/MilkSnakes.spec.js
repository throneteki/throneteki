describe('Milk Snakes', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Milk Snakes', gold: 1 }, 'Burned Men'] }
        });
        this.player1.clickCard(this.milkSnakes);
        this.player1.clickCard(this.burnedMen);
    });

    it('moves 1 gold from itself to a Clansman you control, and gives each Clansman you control with gold a power icon', function () {
        expect(this.burnedMen.gold).toBe(1);
        expect(this.burnedMen.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
