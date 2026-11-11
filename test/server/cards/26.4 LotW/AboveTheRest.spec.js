describe('Above the Rest', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Above the Rest'], inPlay: ['Tytos Blackwood (LotW)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tytosBlackwood);
        this.player1.triggerAbility(this.aboveTheRest);
    });

    it('gives a character that gained exactly 1 power another power, and stands it if it is House Tully', function () {
        expect(this.tytosBlackwood.power).toBe(2);
        expect(this.tytosBlackwood.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
