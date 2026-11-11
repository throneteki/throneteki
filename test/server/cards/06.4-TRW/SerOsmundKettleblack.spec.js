describe('Ser Osmund Kettleblack', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [{ card: 'Ser Osmund Kettleblack', gold: 1 }, 'Tumblestone Knight'],
                hand: ['Ser Jaime Lannister (Core)']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.serOsmundKettleblack);
        this.player1.clickCard(this.serJaimeLannister);
    });

    it('discards 1 gold to put a Knight into play from your hand, and discards it at the end of the phase', function () {
        expect(this.serJaimeLannister.location).toBe('play area');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.completeChallengesPhase();

        expect(this.serJaimeLannister.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
