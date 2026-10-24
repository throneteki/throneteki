describe('Stannis Baratheon (FotS)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Stannis Baratheon (FotS)'] } });
        this.unopposedChallenge(this.player1, 'Power', this.stannisBaratheon);
        this.player1.triggerAbility(this.stannisBaratheon);
    });

    it("draws cards equal to the attacking player's claim after you win a power challenge", function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
