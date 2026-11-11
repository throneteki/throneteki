describe('The Shadow Tower (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Shadow Tower (TSoW)'] },
            player2: { shadows: ['Undercity Spymaster'] }
        });
        this.player1.clickCard(this.theShadowTower);
        this.player1.clickCard(this.undercitySpymaster);
    });

    it("kneels to reveal a card in an opponent's shadows and put it into play under your control if it is a non-unique character, which then gets +1 STR", function () {
        expect(this.undercitySpymaster.location).toBe('play area');
        expect(this.undercitySpymaster.controller).toBe(this.player1Object);
        expect(this.undercitySpymaster.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
