describe('A Storm of Swords', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'A Storm of Swords',
                inPlay: ['Tumblestone Knight', 'Hedge Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });

        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player2.clickCard(this.bastardInHiding);
    });

    it('lets you initiate an additional [military] challenge', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');

        expect(this.game.currentChallenge.challengeType).toBe('military');
        expect(this.game.currentChallenge.number).toBe(2);
    });

    it('does not let you initiate a third', function () {
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);

        expect(this.player1).toHaveDisabledPromptButton('Military');
        expect(this.player1).isReadyToTakeAction();
    });
});
