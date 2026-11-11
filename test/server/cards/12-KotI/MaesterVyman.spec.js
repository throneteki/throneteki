describe('Maester Vyman', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Maester Vyman', 'Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player1.triggerAbility(this.maesterVyman);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to give another character that shares a Trait with him 1 power after you win a military or power challenge', function () {
        expect(this.maesterVyman.kneeled).toBe(true);
        expect(this.tumblestoneKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
