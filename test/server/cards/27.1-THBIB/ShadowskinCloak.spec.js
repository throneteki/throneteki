describe('Shadowskin Cloak', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Tumblestone Knight', attachments: ['Shadowskin Cloak'] }] }
        });
    });

    it('gives the attached character stealth and returns to your hand when the challenges phase ends', function () {
        expect(this.tumblestoneKnight.hasKeyword('stealth')).toBe(true);

        this.completeChallengesPhase();

        expect(this.shadowskinCloak.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
