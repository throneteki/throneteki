describe('Blackbird', function () {
    describe('after it comes out of shadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    shadows: ['Blackbird'],
                    inPlay: [{ card: 'Castle Black (Core)', kneeling: true }]
                }
            });
            this.reserveBefore = this.player1Object.getReserve();
            this.player1.clickCard(this.blackbird);
            this.player1.triggerAbility(this.blackbird);
            this.player1.clickCard(this.castleBlack);
        });

        it("stands another Night's Watch location, and gives +1 reserve", function () {
            expect(this.castleBlack.kneeled).toBe(false);
            expect(this.player1Object.getReserve()).toBe(this.reserveBefore + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
