describe('The Might of the Reach', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                hand: ['The Might of the Reach'],
                inPlay: ['Tumblestone Knight'],
                gold: 3
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theMightOfTheReach);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('gives a participating character +10 STR until the end of the challenge', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(12);
        expect(this.player2).isReadyToTakeAction();
    });
});
