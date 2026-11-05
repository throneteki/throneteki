describe('The Wolfswood (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Wolfswood (Core)'],
                hand: ['Summer (Core)', 'Tumblestone Knight']
            }
        });
    });

    it('gives each Direwolf card in your hand ambush equal to its printed cost', function () {
        expect(this.summer.isAmbush()).toBe(true);
        expect(this.summer.getAmbushCost()).toBe(this.summer.getPrintedCost());
        expect(this.tumblestoneKnight.isAmbush()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
