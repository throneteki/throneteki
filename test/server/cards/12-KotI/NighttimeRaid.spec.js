describe('Nighttime Raid', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Nighttime Raid'], inPlay: ["Black Wind's Crew"], gold: 1 }
        });
        this.player1.clickCard(this.nighttimeRaid);
        this.player1.clickCard(this.blackWindsCrew);
        this.player1.clickPrompt('Done');
    });

    it('gives up to 3 characters with pillage or the Raider trait stealth until the end of the phase', function () {
        expect(this.blackWindsCrew.hasKeyword('stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
