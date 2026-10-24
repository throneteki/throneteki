describe('Sword of the Morning (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Obara Sand (Core)', attachments: ['Sword of the Morning (HMW)'] }]
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.obaraSand);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.swordOfTheMorning);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
    });

    it('makes up to 3 characters defend after the attached character attacks, and gives it +1 STR for each defending character', function () {
        expect(this.tumblestoneKnight.isDefending()).toBe(true);
        expect(this.obaraSand.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
