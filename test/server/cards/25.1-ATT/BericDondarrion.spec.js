describe('Beric Dondarrion (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Beric Dondarrion (ATT)'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.bericDondarrion);
        this.player1.triggerAbility(this.bericDondarrion);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('stops a character controlled by the losing opponent kneeling or standing after he wins a challenge attacking', function () {
        expect(this.tumblestoneKnight.allowGameAction('kneel')).toBe(false);
        expect(this.tumblestoneKnight.allowGameAction('stand')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
