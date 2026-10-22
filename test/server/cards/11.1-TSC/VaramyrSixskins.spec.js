describe('Varamyr Sixskins', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Varamyr Sixskins'] } });
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.varamyrSixskins);
        this.player1.clickPrompt('Bear');
    });

    it('gains the chosen form until the end of the phase after the challenges phase begins', function () {
        expect(this.varamyrSixskins.hasTrait('Bear')).toBe(true);
        expect(this.varamyrSixskins.getStrength()).toBe(8);
        expect(this.player1).isReadyToTakeAction();
    });
});
