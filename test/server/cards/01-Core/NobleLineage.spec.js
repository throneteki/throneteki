describe('Noble Lineage', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'House Maester', attachments: ['Noble Lineage'] }]
            }
        });
    });

    it('gives the attached character a [power] icon', function () {
        expect(this.houseMaester.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
