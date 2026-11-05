describe('The Seed is Strong', function () {
    function setup(hand) {
        this.setupTest({
            phase: 'plot',
            player1: { hand: ['The Seed is Strong'] },
            player2: { plotDeck: ['Sneak Attack'], hand }
        });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Sneak Attack');
        this.selectFirstPlayer(this.player2);
        this.player1.triggerAbility('The Seed is Strong');
    }

    it('has the winning opponent discard a Lord or Lady from their hand after you lose initiative', function () {
        setup.call(this, ['Robb Stark (Core)', 'Hedge Knight']);
        this.player2.clickCard(this.robbStark);
        expect(this.robbStark.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('hand');
    });

    it('has them reveal their hand instead if it has no Lord or Lady', function () {
        setup.call(this, ['Hedge Knight']);
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1).not.toHavePrompt('Any reactions?');
    });
});
