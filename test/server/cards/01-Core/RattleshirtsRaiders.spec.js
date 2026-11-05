describe("Rattleshirt's Raiders", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Rattleshirt's Raiders"] },
            player2: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.rattleshirtsRaiders);
        this.player1.triggerAbility(this.rattleshirtsRaiders);
        this.player1.clickCard(this.littleBird);
    });

    it('discards an attachment controlled by the losing opponent after it wins a challenge as an attacker', function () {
        expect(this.littleBird.location).toBe('discard pile');

        this.player2.clickCard(this.tumblestoneKnight);
        expect(this.player1).isReadyToTakeAction();
    });
});
