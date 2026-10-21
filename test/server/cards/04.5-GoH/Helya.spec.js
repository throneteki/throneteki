describe('Helya', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    'Helya',
                    { card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }
                ]
            }
        });
    });

    it('gives each attachment terminal', function () {
        expect(this.littleBird.hasKeyword('Terminal')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
