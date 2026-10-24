describe('Red Keep Servant', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Red Keep Servant', 'The Iron Throne (Core)']
            }
        });
    });

    it("gains an [intrigue] icon while you control a King's Landing location", function () {
        expect(this.redKeepServant.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
