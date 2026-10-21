describe('A New Hand', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Grand Maester Pycelle (Core)'],
                hand: ['A New Hand'],
                drawDeck: ['Littlefinger (Core)']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.grandMaesterPycelle);
    });

    it('searches your deck for a different Small Council character after one you control leaves play', function () {
        this.player1.triggerAbility(this.aNewHand);

        this.player1.clickCard(this.littlefinger);

        expect(this.littlefinger.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
