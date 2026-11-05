describe('Quiet as a Shadow', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Quiet as a Shadow'], inPlay: ['Bran Stark (Core)'] }
        });
        this.player1.clickCard(this.quietAsAShadow);
        this.player1.clickCard(this.branStark);
    });

    it('gives a unique character with printed cost 3 or lower stealth until the end of the phase', function () {
        expect(this.branStark.hasKeyword('stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
