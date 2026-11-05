describe('Halder (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Halder (R)', "Brandon's Gift", 'The Shadow Tower (WotN)']
            }
        });
        this.player1.clickCard(this.halder);
        this.player1.clickCard(this.brandonsGift);
        this.player1.clickCard(this.theShadowTower);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.halder);
    });

    it('kneels X thenightswatch locations or attachments to give a thenightswatch character +X STR until the end of the phase', function () {
        expect(this.theShadowTower.kneeled).toBe(true);
        expect(this.halder.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
