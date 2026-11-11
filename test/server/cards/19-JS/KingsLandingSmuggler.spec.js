describe("King's Landing Smuggler", function () {
    describe('when it leaves play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: ["King's Landing Smuggler (JS)", 'Tumblestone Knight'] },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
            this.player1.clickCard(this.kingsLandingSmuggler);
            this.player1.triggerAbility(this.kingsLandingSmuggler);
            this.player1.clickCard(this.tumblestoneKnight);
        });

        it('places 1 gold from the treasury on a card without gold', function () {
            expect(this.tumblestoneKnight.gold).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
