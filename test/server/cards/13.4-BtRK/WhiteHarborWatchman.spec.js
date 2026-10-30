describe('White Harbor Watchman', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['White Harbor Watchman'] },
            player2: { shadows: ['Undercity Spymaster'], gold: 3 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.undercitySpymaster);
        this.player1.triggerAbility(this.whiteHarborWatchman);
    });

    it('sacrifices itself to kill a character after it comes out of shadows', function () {
        expect(this.whiteHarborWatchman.location).toBe('discard pile');
        expect(this.undercitySpymaster.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
