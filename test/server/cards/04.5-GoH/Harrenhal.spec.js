describe('Harrenhal (GoH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Harrenhal (GoH)'] },
            player2: { hand: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.littlefinger);
        this.player1.triggerAbility(this.harrenhal);
    });

    it('kneels your faction card and sacrifices itself to kill a character after it enters play', function () {
        expect(this.harrenhal.location).toBe('discard pile');
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.littlefinger.location).toBe('dead pile');
    });

    it('does not prompt to trigger the ability of the character that was killed', function () {
        expect(this.player2).not.toAllowAbilityTrigger(this.littlefinger);
        expect(this.player2).isReadyToTakeAction();
    });
});
