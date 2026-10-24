describe('Tywin Lannister (ChoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tywin Lannister (ChoS)'], gold: 6 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tywinLannister);
        this.player1.triggerAbility(this.tywinLannister);
    });

    it('gains 1 power for every 3 gold in your gold pool after you win a challenge he participates in', function () {
        expect(this.tywinLannister.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
