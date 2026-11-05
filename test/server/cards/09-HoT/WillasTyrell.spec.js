describe('Willas Tyrell (HoT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'Willas Tyrell (HoT)',
                    { card: 'Margaery Tyrell (Core)', kneeling: true },
                    'The Knight of Flowers (Core)',
                    'Ser Garlan Tyrell (HoT)'
                ]
            }
        });
        this.player1.clickMenu(this.willasTyrell, 'Kneel Willas and stand/give keywords');
    });

    it('kneels, then stands Margaery and gives The Knight of Flowers insight and Ser Garlan renown', function () {
        expect(this.willasTyrell.kneeled).toBe(true);
        expect(this.margaeryTyrell.kneeled).toBe(false);
        expect(this.theKnightOfFlowers.hasKeyword('insight')).toBe(true);
        expect(this.serGarlanTyrell.hasKeyword('renown')).toBe(true);
    });
});
