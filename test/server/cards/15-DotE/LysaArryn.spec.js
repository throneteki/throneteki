describe('Lysa Arryn (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Lysa Arryn (DotE)', 'Sweet Cersei']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.lysaArryn);
    });

    it('removes another card from the game when she is killed', function () {
        this.player1.triggerAbility(this.lysaArryn);
        this.player1.clickCard(this.sweetCersei);

        expect(this.lysaArryn.location).toBe('dead pile');
        expect(this.sweetCersei.location).toBe('out of game');
        expect(this.player2).isReadyToTakeAction();
    });
});
