describe('The Knight of Flowers (HoT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['The Knight of Flowers (HoT)'], hand: ['Confinement'], gold: 1 },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.confinement);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.theKnightOfFlowers);
    });

    it('has renown, and gets +2 STR until the end of the phase after you play an event', function () {
        expect(this.theKnightOfFlowers.hasKeyword('renown')).toBe(true);
        expect(this.theKnightOfFlowers.getStrength()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });
});
