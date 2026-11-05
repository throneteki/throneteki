describe('Red-Apple Knight (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Red-Apple Knight (ATT)', 'The Knight of Flowers (Core)']
            }
        });
    });

    it("gets +X STR while you control exactly 1 unique [tyrell] Knight, where X is that character's STR", function () {
        expect(this.redAppleKnight.getStrength()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});
