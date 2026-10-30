describe('Garth the Gross', function () {
    describe('while you control another tyrell Lord and a tyrell Lady', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Garth the Gross', 'Mace Tyrell (HoT)', 'Margaery Tyrell (Core)']
                }
            });
        });

        it('gains a military icon, renown, an intrigue icon and +2 STR', function () {
            expect(this.garthTheGross.hasIcon('military')).toBe(true);
            expect(this.garthTheGross.hasKeyword('Renown')).toBe(true);
            expect(this.garthTheGross.hasIcon('intrigue')).toBe(true);
            expect(this.garthTheGross.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
