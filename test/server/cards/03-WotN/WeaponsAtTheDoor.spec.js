describe('Weapons at the Door', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Weapons at the Door',
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }]
            }
        });

        this.completeMarshalPhase();
    });

    it("returns each attachment to its owner's hand after the challenges phase begins", function () {
        expect(this.littleBird.location).toBe('hand');
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
