describe('Sea Dragon Tower', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Sea Dragon Tower', 'Tumblestone Knight'] },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.seaDragonTower);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels to give a character a power icon until the end of the phase', function () {
        expect(this.seaDragonTower.kneeled).toBe(true);
        expect(this.burnedMen.hasIcon('power')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
