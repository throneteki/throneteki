describe('Harrenhal (FFH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Harrenhal (FFH)', 'Tumblestone Knight'],
                hand: ['Ser Jaime Lannister (Core)']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.harrenhal);
        this.player1.clickCard(this.serJaimeLannister);
    });

    it('kneels to put a lannister or House Bolton character into play from your hand, and kills it at the end of the phase', function () {
        expect(this.serJaimeLannister.location).toBe('play area');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.completeChallengesPhase();

        expect(this.serJaimeLannister.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
