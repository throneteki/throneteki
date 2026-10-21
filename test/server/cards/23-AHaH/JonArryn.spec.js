describe('Jon Arryn (AHaH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Jon Arryn (AHaH)']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.jonArryn);
    });

    it('cannot be saved, and lets each player draw 2 cards or gain 1 power when he is killed', function () {
        this.player1.clickPrompt('Gain 1 power');
        this.player2.clickPrompt('Draw 2 cards');

        expect(this.jonArryn.location).toBe('dead pile');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2Object.hand).toHaveLength(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
