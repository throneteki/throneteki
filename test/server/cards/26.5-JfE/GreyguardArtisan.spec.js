describe('Greyguard Artisan', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Greyguard Artisan'], gold: 2 },
            player2: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Little Bird (Core)'] }]
            }
        });
        this.player1.clickCard(this.greyguardArtisan);
        this.player1.triggerAbility(this.greyguardArtisan);
        this.player1.clickCard(this.littleBird);
    });

    it('blanks an attachment until the end of the phase after it comes out of shadows', function () {
        expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
