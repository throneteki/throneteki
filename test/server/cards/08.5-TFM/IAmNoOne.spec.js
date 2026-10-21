describe('I Am No One (TFM)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['I Am No One (TFM)'], inPlay: ['Tumblestone Knight'], gold: 1 }
        });
        this.player1.clickCard(this.iAmNoOne);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('makes a character you control with printed cost 3 or lower lose its factions and Traits and gain insight and stealth', function () {
        expect(this.tumblestoneKnight.isFaction('stark')).toBe(false);
        expect(this.tumblestoneKnight.hasTrait('Knight')).toBe(false);
        expect(this.tumblestoneKnight.hasKeyword('stealth')).toBe(true);
        expect(this.tumblestoneKnight.hasKeyword('insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
