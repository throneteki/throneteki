describe("Water Dancer's Sword", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ["Water Dancer's Sword"] }]
            }
        });
    });

    it('gives the attached character +2 STR and returns to your hand when the challenges phase ends', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(4);

        this.completeChallengesPhase();

        expect(this.waterDancersSword.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
