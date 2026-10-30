describe('Raider from Pyke (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Raider from Pyke (R)'],
                hand: ['Bearskin Cloak', 'Little Bird (Core)']
            }
        });
    });

    it('gives each Item or Weapon card in your hand ambush equal to its printed cost', function () {
        expect(this.bearskinCloak.isAmbush()).toBe(true);
        expect(this.bearskinCloak.getAmbushCost()).toBe(1);
        expect(this.littleBird.isAmbush()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
