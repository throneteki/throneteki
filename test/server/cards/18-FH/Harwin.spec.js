describe('Harwin (FH)', function () {
    describe('during a challenge with a participating non-loyal character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'Harwin (FH)', gold: 1 }, 'Robert Baratheon (Core)'] }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.harwin);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(this.harwin, 'Discard 1 gold');
        });

        it('discards 1 gold to have a character with 2 or more keywords participate on your side', function () {
            expect(this.player1).toHavePrompt('Select a character');
            expect(this.robertBaratheon.isParticipating()).toBe(false);
            this.player1.clickCard(this.robertBaratheon);
            expect(this.robertBaratheon.isParticipating()).toBe(true);
            expect(this.harwin.gold).toBe(0);
        });
    });
});
