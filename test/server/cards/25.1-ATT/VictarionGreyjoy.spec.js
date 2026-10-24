describe('Victarion Greyjoy (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Victarion Greyjoy (ATT)', 'Acolyte of the Shadow (ChoS)'] }
        });
        this.player1.triggerAbility('Victarion Greyjoy');
        this.player1.clickCard(this.acolyteOfTheShadow);
    });

    it("kneels a R'hllor character to gain insight and immunity until the end of the phase", function () {
        expect(this.acolyteOfTheShadow.kneeled).toBe(true);
        expect(this.victarionGreyjoy.hasKeyword('Insight')).toBe(true);
    });
});
