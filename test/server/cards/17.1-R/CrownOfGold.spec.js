describe('Crown of Gold (R)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Ser Jaime Lannister (Core)', attachments: ['Crown of Gold (R)'] }]
            }
        });
    });

    it('gives the attached character the King trait and -4 STR', function () {
        expect(this.serJaimeLannister.hasTrait('King')).toBe(true);
        expect(this.serJaimeLannister.getStrength()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
