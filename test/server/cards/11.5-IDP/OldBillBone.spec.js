describe('Old Bill Bone', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { shadows: ['Old Bill Bone'] } });
        this.player1.clickCard(this.oldBillBone);
        this.player1.triggerAbility(this.oldBillBone);
    });

    it("kneels each opponent's faction card after he comes out of shadows", function () {
        expect(this.player2Object.faction.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
