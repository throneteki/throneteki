describe('Doran Martell (SoD)', function () {
    it('kneels your faction card to remove a participating character with fewer than 2 icons from the challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Doran Martell (SoD)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.player1.clickMenu(this.doranMartell, 'Remove character from challenge');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.hedgeKnight.isParticipating()).toBe(false);
    });

    it('has a character gain or lose an icon until the end of the phase after you lose a challenge', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Doran Martell (SoD)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.triggerAbility('Doran Martell');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Gain Icon');
        this.player1.clickPrompt('Intrigue');
        expect(this.hedgeKnight.hasIcon('intrigue')).toBe(true);
    });
});
