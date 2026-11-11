describe('Coordinated Attack', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Coordinated Attack',
                inPlay: ['Tumblestone Knight', 'Eddard Stark (Core)', 'Khal Drogo (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player1.triggerAbility(this.coordinatedAttack);
    });

    it('lets you initiate an additional challenge of a different type this phase after you win a challenge as the attacker', function () {
        expect(this.player1).not.toHavePromptButton('Military');

        this.player1.clickPrompt('Power');
        this.unopposedChallenge(this.player1, 'Power', this.eddardStark);

        expect(this.player1).not.toHaveDisabledPromptButton('Power');

        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);

        expect(this.player1).toHaveDisabledPromptButton('Power');
        expect(this.player1).isReadyToTakeAction();
    });
});
