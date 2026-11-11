describe('Wyman Manderly (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Wyman Manderly (R)', kneeling: true }, 'Tumblestone Knight']
            }
        });
        this.player1.clickCard(this.wymanManderly);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.wymanManderly);
    });

    it('kills a standing character you control, and stands and draws 1 card after a character you control is killed', function () {
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.wymanManderly.kneeled).toBe(false);
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
