describe('Bran Stark (OR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Bran Stark (OR)', { card: 'Summer (Core)', kneeling: true }] }
        });
        this.player1.clickCard(this.branStark);
        this.player1.clickCard(this.summer);
        this.player1.clickPrompt('Intrigue');
    });

    it('kneels to stand a Direwolf and give it a challenge icon of your choice until the end of the phase', function () {
        expect(this.branStark.kneeled).toBe(true);
        expect(this.summer.kneeled).toBe(false);
        expect(this.summer.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
