describe('Acolyte of the Flame', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Acolyte of the Flame'] },
            player2: { drawDeck: ['Hedge Knight', 'Castle Guard', 'The Roseroad', 'The Kingsroad'] }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Acolyte of the Flame');
        this.player1.clickPrompt('Done');
    });

    it("kneels after the draw phase begins to look at the top 2 cards of an opponent's deck and may put them on the bottom", function () {
        this.player1.clickPrompt('Yes');
        expect(this.acolyteOfTheFlame.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('draw deck');
        expect(this.castleGuard.location).toBe('draw deck');
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.theKingsroad.location).toBe('hand');
    });

    it('leaves them on top if you choose not to', function () {
        this.player1.clickPrompt('No');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.castleGuard.location).toBe('hand');
    });
});
