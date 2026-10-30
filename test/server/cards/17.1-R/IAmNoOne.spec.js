describe('I Am No One (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['I Am No One (R)'], inPlay: ['Bran Stark (Core)'], gold: 1 }
        });
        this.player1.clickCard(this.iAmNoOne);
        this.player1.clickCard(this.branStark);
    });

    it('makes Arya Stark or a unique character you control with printed cost 3 or lower lose its factions and Traits and gain insight', function () {
        expect(this.branStark.isFaction('stark')).toBe(false);
        expect(this.branStark.hasTrait('Lord')).toBe(false);
        expect(this.branStark.hasKeyword('insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
