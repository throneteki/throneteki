describe('Beggar King', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: [{ card: 'Targaryen Loyalist', attachments: ['Beggar King'] }] },
            player2: { plotDeck: ['Marching Orders'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Marching Orders');
        this.selectFirstPlayer(this.player2);
        this.player1.triggerAbility('Beggar King');
    });

    it('kneels to gain 2 gold after an opponent reveals a plot with higher printed gold', function () {
        expect(this.beggarKing.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(2);
        expect(this.targaryenLoyalist.hasTrait('King')).toBe(true);
    });
});
