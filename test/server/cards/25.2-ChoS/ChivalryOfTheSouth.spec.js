describe('Chivalry of the South', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'Chivalry of the South (ChoS)', inPlay: ['Tumblestone Knight'] },
            player2: { inPlay: [{ card: 'Scorpion Knight', attachments: ['War Scorpion (TSoW)'] }] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('gains 2 power for your faction when a challenge ends with no participating characters', function () {
        this.player1.clickPrompt('Pass');
        this.player2.clickMenu(this.warScorpion, 'Remove attacker from challenge');
        this.player2.clickCard(this.tumblestoneKnight);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.chivalryOfTheSouth);

        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not trigger when a challenge ends with participating characters', function () {
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.scorpionKnight);

        expect(this.player1).not.toAllowAbilityTrigger(this.chivalryOfTheSouth);
        expect(this.player1).isReadyToTakeAction();
    });
});
