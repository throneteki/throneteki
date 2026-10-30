describe('Jeweled Tiara', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Selyse Baratheon (Core)', attachments: ['Jeweled Tiara'] }]
            },
            player2: { hand: ['Tumblestone Knight', 'Sweet Cersei'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.selyseBaratheon);
        this.player1.triggerAbility(this.jeweledTiara);
    });

    it("gives the attached character the Queen trait, and kneels to discard 1 card at random from the losing opponent's hand after you win an intrigue challenge it participates in", function () {
        expect(this.selyseBaratheon.hasTrait('Queen')).toBe(true);
        expect(this.player2Object.hand).toHaveLength(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
