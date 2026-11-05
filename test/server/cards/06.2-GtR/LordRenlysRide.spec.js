describe("Lord Renly's Ride", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Hedge Knight'],
                hand: ['"Lord Renly\'s Ride"'],
                deadPile: ['Castle Guard', 'Robb Stark (Core)']
            }
        });
        this.player1.clickCard(this.lordRenlysRide);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('gives a character +X STR and intimidate, where X is the printed STR of the top character in your dead pile', function () {
        expect(this.hedgeKnight.getStrength()).toBe(
            this.hedgeKnight.getPrintedStrength() + this.robbStark.getPrintedStrength()
        );
        expect(this.hedgeKnight.hasKeyword('Intimidate')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
