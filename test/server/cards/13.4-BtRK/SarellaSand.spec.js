describe('Sarella Sand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', inPlay: ['Sarella Sand', 'Tumblestone Knight'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.sarellaSand);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.sarellaSand);
    });

    it('lets you initiate an additional challenge of that type after you lose a challenge she is attacking in', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.tumblestoneKnight.isAttacking()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
