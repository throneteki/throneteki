describe('The Wall (TMoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['The Wall (TMoW)', 'Tumblestone Knight'] },
            player2: { discard: ['Hot Pie (FFH)'] }
        });
        expect(this.tumblestoneKnight.isFaction('thenightswatch')).toBe(true);
        expect(this.tumblestoneKnight.isFaction('stark')).toBe(false);
        this.player1.clickCard(this.theWall);
        this.player2.clickCard(this.hotPie);
    });

    it("makes your characters thenightswatch only, and kneels to put a character of an opponent's choice from their discard pile into play under your control", function () {
        expect(this.hotPie.location).toBe('play area');
        expect(this.hotPie.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});
