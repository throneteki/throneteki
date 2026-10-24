describe('Jinglebell (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Jinglebell (HMW)'],
                drawDeck: ['Black Walder']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.jinglebell);
    });

    it('searches your deck for a card that shares a Trait with him when he is killed', function () {
        this.player1.triggerAbility(this.jinglebell);
        this.player1.clickCard(this.blackWalder);

        expect(this.blackWalder.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
