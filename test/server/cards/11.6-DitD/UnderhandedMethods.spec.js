describe('Underhanded Methods', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Underhanded Methods'] }],
                shadows: ['Ser Andrey Dalt']
            }
        });
    });

    it('gives the attached character +1 STR for each card you control in shadows', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
