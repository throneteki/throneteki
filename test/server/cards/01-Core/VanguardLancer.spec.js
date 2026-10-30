describe('Vanguard Lancer', function () {
    describe('after it enters play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { hand: ['Vanguard Lancer'] },
                player2: { power: 1 }
            });
            this.player1.clickCard(this.vanguardLancer);
            this.player1.triggerAbility(this.vanguardLancer);
            this.player1.clickCard(this.player2Object.faction);
        });

        it("discards 1 power from an opponent's faction card", function () {
            expect(this.player2Object.faction.power).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
