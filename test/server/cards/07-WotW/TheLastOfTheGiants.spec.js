describe('"The Last of the Giants"', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['"The Last of the Giants"', 'Hot Pie (FFH)'],
                inPlay: ['Tumblestone Knight'],
                gold: 2
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theLastOfTheGiants);
        this.player1.clickCard(this.hotPie);
    });

    it('puts a neutral character into play from your hand with intimidate, and kills it at the end of the phase', function () {
        expect(this.hotPie.location).toBe('play area');
        expect(this.hotPie.hasKeyword('intimidate')).toBe(true);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.completeChallengesPhase();

        expect(this.hotPie.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
