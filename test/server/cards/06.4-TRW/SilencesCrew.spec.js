describe("Silence's Crew", function () {
    describe('after it discards a location using pillage', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ["Silence's Crew"] },
                player2: { drawDeck: ['The Kingsroad'] }
            });
            this.unopposedChallenge(this.player1, 'Power', this.silencesCrew);
            this.player1.triggerAbility(this.silencesCrew);
        });

        it('places 1 gold from the treasury on itself, and gets +2 STR for it', function () {
            expect(this.silencesCrew.gold).toBe(1);
            expect(this.silencesCrew.getStrength()).toBe(6);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
