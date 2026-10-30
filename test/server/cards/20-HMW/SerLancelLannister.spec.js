describe('Ser Lancel Lannister (HMW)', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [
                        'Ser Lancel Lannister (HMW)',
                        { card: 'Catelyn Stark (Core)', power: 2 }
                    ],
                    hand: ["Warrior's Sons (FotOG)"]
                }
            });
            expect(this.player1Object.getTotalPower()).toBe(0);
            this.player1.clickMenu(this.serLancelLannister, "Put Warrior's Sons into play");
            this.player1.clickCard(this.warriorsSons);
        });

        it("stops power on Lords and Ladies counting, and kneels to put Warrior's Sons into play", function () {
            expect(this.serLancelLannister.kneeled).toBe(true);
            expect(this.warriorsSons.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
