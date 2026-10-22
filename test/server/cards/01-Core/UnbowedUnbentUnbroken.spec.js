describe('Unbowed, Unbent, Unbroken', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { hand: ['Unbowed, Unbent, Unbroken'] },
            player2: { inPlay: ['Khal Drogo (Core)', 'Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.khalDrogo);
        this.player1.triggerAbility(this.unbowedUnbentUnbroken);
        this.player1.clickPrompt('Power');
    });

    it('stops the winner initiating challenges of the named type this phase after you lose a challenge as the defender', function () {
        expect(this.player2).toHaveDisabledPromptButton('Power');
        expect(this.player2).not.toHaveDisabledPromptButton('Intrigue');
        expect(this.player2).isReadyToTakeAction();
    });
});
