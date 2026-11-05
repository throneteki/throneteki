describe("Craster's Keep Mutineer", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ["Craster's Keep Mutineer"] },
            player2: { inPlay: [{ card: 'Ser Jaime Lannister (Core)', dupes: 1 }] }
        });
        this.player1.clickCard(this.crastersKeepMutineer);
        this.player1.triggerAbility(this.crastersKeepMutineer);
    });

    it('discards a duplicate on a character after it enters play', function () {
        this.player1.clickCard(this.serJaimeLannister.dupes[0]);

        expect(this.serJaimeLannister.dupes).toHaveLength(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
