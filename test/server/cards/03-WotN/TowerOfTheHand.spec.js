describe('Tower of the Hand (WotN)', function () {
    describe('after you win an intrigue challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Tower of the Hand (WotN)', 'Cersei Lannister (LoCR)'] },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.cerseiLannister);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.towerOfTheHand);
            this.player1.clickCard(this.cerseiLannister);
            this.player1.clickCard(this.hedgeKnight);
        });

        it("kneels and returns a participating lannister character to your hand to return a cheaper character to its owner's hand", function () {
            expect(this.towerOfTheHand.kneeled).toBe(true);
            expect(this.cerseiLannister.location).toBe('hand');
            // Intrigue claim then discards at random from that hand, so the returned card may already be discarded.
            expect(['hand', 'discard pile']).toContain(this.hedgeKnight.location);
        });
    });
});
