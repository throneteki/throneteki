describe('Raider from Pyke (CoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Raider from Pyke (CoW)'],
                hand: ['Longclaw', 'Little Bird (Core)']
            }
        });
    });

    it('gives each Weapon card in your hand ambush equal to its printed cost', function () {
        expect(this.longclaw.isAmbush()).toBe(true);
        expect(this.longclaw.getAmbushCost()).toBe(2);
        expect(this.littleBird.isAmbush()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
