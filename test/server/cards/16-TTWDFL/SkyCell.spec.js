describe('Sky Cell', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                inPlay: [{ card: 'Hedge Knight', attachments: ['Sky Cell'] }, 'Winterfell Steward']
            }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('kneels the attached character when its controller would draw cards, and they draw 1 less', function () {
        expect(this.hedgeKnight.kneeled).toBe(true);
        expect(this.player1Object.hand.length).toBe(1);
        expect(this.player2Object.hand.length).toBe(2);
    });

    it('gives the attached character an action to kill itself, which cannot be saved', function () {
        this.player1.clickMenu(this.hedgeKnight, 'Kill character');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.winterfellSteward.location).toBe('play area');
    });
});
