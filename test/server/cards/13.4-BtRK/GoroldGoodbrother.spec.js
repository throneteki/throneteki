describe('Gorold Goodbrother', function () {
    describe("after a location enters an opponent's discard pile", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Gorold Goodbrother'] },
                player2: { drawDeck: ['The Kingsroad'] }
            });
            this.unopposedChallenge(this.player1, 'Power', this.goroldGoodbrother);
            this.player1.triggerAbility(this.goroldGoodbrother);
        });

        it('stands him', function () {
            expect(this.theKingsroad.location).toBe('discard pile');
            expect(this.goroldGoodbrother.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
