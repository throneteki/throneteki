describe('When All Is Darkest (WAID)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['When All Is Darkest (WAID)'], gold: 2 },
            player2: { shadows: ['Undercity Spymaster'], gold: 3 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.undercitySpymaster);
        this.player1.triggerAbility(this.whenAllIsDarkest);
    });

    it('kneels your faction card to take control of a character after it comes out of shadows', function () {
        expect(this.undercitySpymaster.controller).toBe(this.player1Object);
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
