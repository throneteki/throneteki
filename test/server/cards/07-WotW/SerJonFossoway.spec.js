describe('Ser Jon Fossoway', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Ser Jon Fossoway', attachments: ['Knighted'] }]
            }
        });
    });

    it('gains renown while his STR is 5 or higher', function () {
        expect(this.serJonFossoway.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
