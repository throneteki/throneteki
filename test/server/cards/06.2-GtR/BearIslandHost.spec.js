describe('Bear Island Host', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: [{ card: 'Bear Island Host', gold: 1 }] }
        });
        this.player1.clickCard(this.bearIslandHost);
        this.player1.clickCard(this.bearIslandHost);
    });

    it('discards 1 gold to stop a House Mormont character kneeling when it attacks in a military challenge this phase', function () {
        expect(this.bearIslandHost.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
