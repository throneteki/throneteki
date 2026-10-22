describe('Whisper Campaign', function () {
    describe('after a character without an intrigue icon enters play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { plot: 'Whisper Campaign', hand: ['Hedge Knight', 'Maester Luwin'] }
            });
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.maesterLuwin);
        });

        it('kneels it', function () {
            expect(this.hedgeKnight.kneeled).toBe(true);
            expect(this.maesterLuwin.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
