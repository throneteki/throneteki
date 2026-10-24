describe('Ashemark Councilor (WAID)', function () {
    describe('after it enters play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Tumblestone Knight', 'Hedge Knight'],
                    hand: ['Ashemark Councilor (WAID)']
                }
            });
            this.player1.clickCard(this.ashemarkCouncilor);
            this.player1.triggerAbility(this.ashemarkCouncilor);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
        });

        it('has up to 3 cards without gold gain 1 gold, and gets STR equal to the number of cards with gold', function () {
            expect(this.tumblestoneKnight.gold).toBe(1);
            expect(this.hedgeKnight.gold).toBe(1);
            expect(this.ashemarkCouncilor.getStrength()).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
