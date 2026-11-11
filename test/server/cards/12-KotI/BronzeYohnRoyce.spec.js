describe('Bronze Yohn Royce', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Bronze Yohn Royce', 'Tourney Grounds'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.bronzeYohnRoyce);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.bronzeYohnRoyce);
        this.player1.clickCard(this.tourneyGrounds);
    });

    it('kneels a neutral location to stand himself after you win a challenge he is defending in', function () {
        expect(this.tourneyGrounds.kneeled).toBe(true);
        expect(this.bronzeYohnRoyce.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
