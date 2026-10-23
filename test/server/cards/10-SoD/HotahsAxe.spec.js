describe("Hotah's Axe", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                hand: ['Areo Hotah (Core)', "Hotah's Axe"],
                gold: 5
            }
        });
        this.player1.clickCard(this.areoHotah);
    });

    it('puts itself into play from your hand attached to a Martell character that entered play during the challenges phase', function () {
        this.player1.triggerAbility("Hotah's Axe");
        expect(this.hotahsAxe.parent).toBe(this.areoHotah);
        expect(this.areoHotah.getStrength()).toBe(this.areoHotah.getPrintedStrength() + 3);
        expect(this.player1Object.gold).toBe(0);
    });
});
