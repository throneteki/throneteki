describe("The Hatchlings' Feast", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ["The Hatchlings' Feast"], gold: 5 },
            player2: { inPlay: ['Hedge Knight', 'Robb Stark (Core)', 'Ranging Party'] }
        });
        this.player1.clickCard(this.theHatchlingsFeast);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.robbStark);
        this.player1.clickCard(this.rangingParty);
    });

    it('gives 3 characters without attachments -1, -2 and -3 STR until the end of the phase', function () {
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() - 1);
        expect(this.robbStark.getStrength()).toBe(this.robbStark.getPrintedStrength() - 2);
        expect(this.rangingParty.getStrength()).toBe(this.rangingParty.getPrintedStrength() - 3);
    });
});
