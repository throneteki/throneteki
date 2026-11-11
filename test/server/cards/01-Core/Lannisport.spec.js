describe('Lannisport (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: ['Lannisport (Core)', 'Littlefinger (Core)'],
                drawDeck: ['Hot Pie (FFH)']
            }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.littlefinger);
        this.player1.triggerAbility(this.lannisport);
    });

    it('draws 1 card after you win an intrigue challenge', function () {
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
