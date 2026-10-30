describe('Blood of the Viper', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: [{ card: 'Maiden of Poisons', attachments: ['Blood of the Viper'] }]
            },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.maidenOfPoisons);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.littlefinger);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.bloodOfTheViper);
    });

    it('stands the attached character after you lose a challenge it is participating in', function () {
        expect(this.maidenOfPoisons.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
