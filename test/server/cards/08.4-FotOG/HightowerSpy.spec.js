describe('Hightower Spy', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Hightower Spy'], drawDeck: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.hightowerSpy);
        this.player1.triggerAbility('Hightower Spy');
        this.player1.clickCard(this.hightowerSpy);
    });

    it('gives the chosen character +X STR, where X is the printed cost of the revealed top card', function () {
        expect(this.hightowerSpy.getStrength()).toBe(
            this.hightowerSpy.getPrintedStrength() + this.hedgeKnight.getPrintedCost()
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
