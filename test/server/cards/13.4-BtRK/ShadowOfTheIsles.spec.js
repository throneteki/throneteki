describe('Shadow of the Isles', function () {
    function setup(plot) {
        this.setupTest({
            player1: {
                plot,
                inPlay: ['Sunspear (Core)', 'The Roseroad'],
                shadows: ['Shadow of the Isles']
            },
            player2: { inPlay: ['Riverrun', 'The Kingsroad'] }
        });
        this.player1.clickCard(this.shadowOfTheIsles);
        expect(this.player1).not.toBeAbleToSelect(this.theRoseroad);
        this.player1.clickCard(this.sunspear);
        this.player2.clickCard(this.riverrun);
    }

    it('has each player choose and discard a non-limited location they control', function () {
        setup.call(this, 'Filler Plot');
        expect(this.sunspear.location).toBe('discard pile');
        expect(this.riverrun.location).toBe('discard pile');
        expect(this.theRoseroad.location).toBe('play area');
        expect(this.theKingsroad.location).toBe('play area');
        expect(this.shadowOfTheIsles.location).toBe('discard pile');
    });

    it('returns to your hand if there is a War plot card revealed', function () {
        setup.call(this, 'A Storm of Swords');
        expect(this.sunspear.location).toBe('discard pile');
        expect(this.shadowOfTheIsles.location).toBe('hand');
    });
});
