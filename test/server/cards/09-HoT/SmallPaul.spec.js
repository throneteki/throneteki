describe('Small Paul', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Small Paul'],
                drawDeck: ['Steward at the Wall']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.smallPaul);
    });

    it('searches the top X cards for any number of Steward characters when he is killed', function () {
        this.player1.triggerAbility(this.smallPaul);
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.clickPrompt('Done');

        expect(this.stewardAtTheWall.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
