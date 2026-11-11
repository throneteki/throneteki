describe('Little Bird (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }]
            }
        });
    });

    it('gives the attached character an [intrigue] icon', function () {
        expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
