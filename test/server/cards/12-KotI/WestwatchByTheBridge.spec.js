describe('Westwatch-by-the-Bridge', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'Westwatch-by-the-Bridge',
                    { card: 'The Shadow Tower (WotN)', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.westwatchByTheBridge);
        this.player1.clickCard(this.theShadowTower);
    });

    it('kneels to stand another thenightswatch location with printed cost 1 or lower', function () {
        expect(this.westwatchByTheBridge.kneeled).toBe(true);
        expect(this.theShadowTower.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
