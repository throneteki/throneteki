describe('Red Lamb', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Red Lamb', 'Ser Barristan Selmy (LoCR)']
            }
        });
    });

    it('gains a [power] icon and the Knight trait while you control Ser Barristan Selmy', function () {
        expect(this.redLamb.hasIcon('power')).toBe(true);
        expect(this.redLamb.hasTrait('Knight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
