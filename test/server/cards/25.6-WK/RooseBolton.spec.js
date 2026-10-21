describe('Roose Bolton (WK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Grand Maester Pycelle (Core)', 'Tumblestone Knight'],
                shadows: ['Roose Bolton (WK)'],
                gold: 5
            }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.grandMaesterPycelle);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.rooseBolton);
        this.player1.triggerAbility(this.rooseBolton);
    });

    it('kills each participating loyal character after he comes out of shadows during a challenge', function () {
        expect(this.grandMaesterPycelle.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('play area');

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).isReadyToTakeAction();
    });
});
