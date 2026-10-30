describe('Wildling Scout', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Wildling Scout', 'Tumblestone Knight'] }
        });
        this.player1.clickCard(this.wildlingScout);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('sacrifices itself to give a character stealth until the end of the phase', function () {
        expect(this.wildlingScout.location).toBe('discard pile');
        expect(this.tumblestoneKnight.hasKeyword('stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
