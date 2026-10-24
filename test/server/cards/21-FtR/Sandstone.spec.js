describe('Sandstone', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Sandstone (FtR)', 'Robb Stark (Core)'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Sandstone');
        this.player1.clickCard(this.robbStark);
    });

    it('has an attacker gain 1 power for each defender with fewer than 2 challenge icons', function () {
        expect(this.sandstone.kneeled).toBe(true);
        expect(this.robbStark.power).toBe(1);
    });
});
