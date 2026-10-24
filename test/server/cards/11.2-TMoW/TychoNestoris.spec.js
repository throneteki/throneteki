describe('Tycho Nestoris', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { plot: 'Trading with the Pentoshi', inPlay: ['Tycho Nestoris'] }
            });
            this.goldBefore = this.player1Object.gold;
            this.player1.clickMenu(this.tychoNestoris, 'Blank Tycho Nestoris');
        });

        it('pays 6 gold to blank his printed text box until the end of the phase', function () {
            expect(this.tychoNestoris.isBlankExcludingTraits()).toBe(true);
            expect(this.player1Object.gold).toBe(this.goldBefore - 6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
