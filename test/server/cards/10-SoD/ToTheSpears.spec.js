describe('To The Spears!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                usedPlots: ['A Noble Cause', 'A Noble Cause', 'A Noble Cause'],
                hand: ['To The Spears!'],
                inPlay: ['House Dayne Knight', 'Hedge Knight']
            }
        });
        this.player1.clickCard(this.toTheSpears);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
    });

    it('stops martell characters kneeling as attackers in the next challenge', function () {
        expect(this.houseDayneKnight.kneeled).toBe(false);
        expect(this.hedgeKnight.kneeled).toBe(true);
    });
});
