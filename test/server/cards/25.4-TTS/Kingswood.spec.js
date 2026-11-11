describe('Kingswood (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Kingswood (TTS)'], hand: ['Burned Men'], gold: 5 }
        });
        this.player1.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.kingswood);
    });

    it('kneels and returns to your hand to draw 1 card after a character you control enters play using ambush', function () {
        expect(this.burnedMen.location).toBe('play area');
        expect(this.kingswood.location).toBe('hand');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
