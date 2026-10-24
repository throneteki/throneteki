describe('A Pinch of Powder', function () {
    describe('after you win a power challenge by 5 or more STR as the attacker', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Ranging Party'], shadows: ['A Pinch of Powder (IDP)'] },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.player1.clickCard(this.aPinchOfPowder);
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.rangingParty);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.aPinchOfPowder);
        });

        it("returns the attached character to its owner's hand", function () {
            expect(this.hedgeKnight.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
