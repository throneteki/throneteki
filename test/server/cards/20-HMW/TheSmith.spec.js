describe('The Smith (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'The Smith (HMW)',
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }]
            },
            player2: { inPlay: ['Sweet Cersei'] }
        });
        this.player1.clickCard(this.theSmith);
        this.player1.clickCard(this.littleBird);
        this.player1.clickCard(this.sweetCersei);
    });

    it('kneels an attachment to kneel a location', function () {
        expect(this.littleBird.kneeled).toBe(true);
        expect(this.sweetCersei.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
