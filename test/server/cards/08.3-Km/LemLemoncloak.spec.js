describe('Lem Lemoncloak', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Lem Lemoncloak']
            }
        });
    });

    it('gets +2 STR and a [power] icon while you control no loyal characters', function () {
        expect(this.lemLemoncloak.getStrength()).toBe(4);
        expect(this.lemLemoncloak.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
