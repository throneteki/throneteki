describe('Moqorro (WAID)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Moqorro (WAID)'], inPlay: ['Tumblestone Knight'], gold: 2 }
        });
        this.player1.clickCard(this.moqorro);
        this.player1.triggerAbility(this.moqorro);
    });

    it('gives a character an intrigue icon and stealth after it comes out of shadows', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(true);
        expect(this.tumblestoneKnight.hasKeyword('stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
