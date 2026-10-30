describe('The Eyrie (CoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['The Eyrie (CoW)'], inPlay: ['Tumblestone Knight'], gold: 4 }
        });
        this.player1.clickCard(this.theEyrie);
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.theEyrie);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('kneels to make a character unkillable until the end of the phase after a phase begins', function () {
        expect(this.theEyrie.kneeled).toBe(true);
        expect(this.tumblestoneKnight.allowGameAction('kill')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
