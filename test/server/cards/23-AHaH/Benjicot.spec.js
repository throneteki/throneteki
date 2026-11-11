describe('Benjicot', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Benjicot', kneeling: true }]
            }
        });

        this.bottomCards = [this.player1Object, this.player2Object].map(
            (player) => player.drawDeck[player.drawDeck.length - 1]
        );
        this.completeChallengesPhase();
    });

    it("reveals the bottom card of each player's deck after he stands, and adds or discards each", function () {
        for (const card of this.bottomCards) {
            expect(card.location).not.toBe('draw deck');
        }
        expect(this.player1).isReadyToTakeAction();
    });
});
