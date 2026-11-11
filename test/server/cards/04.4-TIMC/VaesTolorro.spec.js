describe('Vaes Tolorro', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Vaes Tolorro', { card: 'Tumblestone Knight', power: 1 }] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.vaesTolorro);
    });

    it('kneels to move 1 power to itself from a character with power that would be killed', function () {
        expect(this.vaesTolorro.power).toBe(1);
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
