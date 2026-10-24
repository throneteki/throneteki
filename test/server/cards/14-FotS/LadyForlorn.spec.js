describe('Lady Forlorn', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Lyn Corbray (VDS)', attachments: ['Lady Forlorn'] },
                    'The Kingsroad'
                ]
            }
        });
    });

    it('gives the attached character +1 STR for each neutral location you control, and a [power] icon if it is Lyn Corbray', function () {
        expect(this.lynCorbray.getStrength()).toBe(6);
        expect(this.lynCorbray.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
