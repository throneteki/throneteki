describe('Gilly', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: 'Gilly', gold: 1 }, 'Steward at the Wall']
            }
        });
        this.player1.clickCard(this.gilly);
        this.player1.clickCard(this.stewardAtTheWall);
    });

    it('discards 1 gold to give a Steward character you control stealth until the end of the phase', function () {
        expect(this.gilly.gold).toBe(0);
        expect(this.stewardAtTheWall.hasKeyword('stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
