describe('A Pinch of Powder', function () {
    describe('during setup', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: { hand: ['A Pinch of Powder (IDP)', 'Hedge Knight'] }
            });
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.aPinchOfPowder);
        });

        it('can only be placed into shadows, as it has no printed cost', function () {
            expect(this.aPinchOfPowder.location).toBe('shadows');
            expect(this.player1Object.getSetupPlacement().cost).toBe(4);
        });
    });

    describe('during marshaling', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { gold: 5, hand: ['A Pinch of Powder (IDP)'], inPlay: ['Hedge Knight'] }
            });
            this.player1.clickCard(this.aPinchOfPowder);
        });

        it('can only be marshaled into shadows, as it has no printed cost', function () {
            expect(this.aPinchOfPowder.location).toBe('shadows');
            expect(this.player1Object.gold).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

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
