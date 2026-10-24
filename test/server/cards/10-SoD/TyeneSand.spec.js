describe('Tyene Sand (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                hand: ['Tyene Sand (SoD)'],
                inPlay: ['Maiden of Poisons']
            },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Intrigue');
        this.player2.clickCard(this.littlefinger);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.tyeneSand);
        this.player1.clickCard(this.maidenOfPoisons);
    });

    it('kneels a Sand Snake to put herself into play from your hand after you lose a challenge as the defender', function () {
        expect(this.maidenOfPoisons.kneeled).toBe(true);
        expect(this.tyeneSand.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
