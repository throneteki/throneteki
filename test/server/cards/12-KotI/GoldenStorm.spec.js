describe('Golden Storm', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Golden Storm', 'Nighttime Marauders (R)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Golden Storm');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('kneels to kill a participating character, then stands if you control a participating Raider', function () {
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.goldenStorm.kneeled).toBe(false);
    });
});
