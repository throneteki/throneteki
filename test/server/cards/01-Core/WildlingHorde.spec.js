describe('Wildling Horde', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Wildling Horde'] } });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.wildlingHorde);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.wildlingHorde);
        this.player1.clickCard(this.wildlingHorde);
    });

    it('kneels your faction card to give a participating Wildling you control +2 STR until the end of the challenge', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.wildlingHorde.getStrength()).toBe(7);
        expect(this.player2).isReadyToTakeAction();
    });
});
