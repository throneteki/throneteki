describe('Knighted', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'House Maester', attachments: ['Knighted'] }]
            }
        });
    });

    it('gives the attached character +1 STR and the Knight trait', function () {
        expect(this.houseMaester.getStrength()).toBe(3);
        expect(this.houseMaester.hasTrait('Knight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
