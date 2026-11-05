describe('Plaza of Punishment', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['Plaza of Punishment', 'Tumblestone Knight']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.player1.triggerAbility(this.plazaOfPunishment);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels to give a character without attachments -2 STR and kill it if its STR is 0 after you win a power challenge', function () {
        expect(this.plazaOfPunishment.kneeled).toBe(true);
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
