describe('Rationing', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                plot: 'Rationing',
                inPlay: ['Ser Jason Mallister']
            },
            player2: {
                shadows: ['Meera Reed (R)']
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.serJasonMallister);
    });

    it('stops players triggering reactions to winning or losing challenges', function () {
        expect(this.player1).not.toAllowAbilityTrigger(this.serJasonMallister);
        expect(this.meeraReed.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
