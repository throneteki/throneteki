describe('Ser Amory Lorch', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Ser Amory Lorch']
            }
        });
    });

    it('gains renown while an opponent controls 3 or fewer characters', function () {
        expect(this.serAmoryLorch.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
