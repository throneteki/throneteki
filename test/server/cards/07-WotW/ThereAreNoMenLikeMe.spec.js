describe('There Are No Men Like Me', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['There Are No Men Like Me'],
                inPlay: ['Tumblestone Knight'],
                gold: 1
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.thereAreNoMenLikeMe);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('stops a Knight kneeling when declared as an attacker or defender in a military challenge this phase', function () {
        expect(this.tumblestoneKnight.isDefending()).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
