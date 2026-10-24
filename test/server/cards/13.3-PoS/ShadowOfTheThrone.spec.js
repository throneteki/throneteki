describe('Shadow of the Throne', function () {
    function setup(plot) {
        this.setupTest({
            player1: { plot, shadows: ['Shadow of the Throne'] },
            player2: { inPlay: ['The Roseroad', 'The Kingsroad', 'The Red Keep (DotE)'] }
        });
        this.player1.clickCard(this.shadowOfTheThrone);
    }

    it('kneels any number of locations with total printed cost 3 or lower', function () {
        setup.call(this, 'Filler Plot');
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickCard(this.theKingsroad);
        expect(this.player1).not.toBeAbleToSelect(this.theRedKeep);
        this.player1.clickPrompt('Done');
        expect(this.theRoseroad.kneeled).toBe(true);
        expect(this.theKingsroad.kneeled).toBe(true);
        expect(this.theRedKeep.kneeled).toBe(false);
        expect(this.shadowOfTheThrone.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns to your hand if there is a Kingdom plot card revealed', function () {
        setup.call(this, 'A Noble Cause');
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickPrompt('Done');
        expect(this.theRoseroad.kneeled).toBe(true);
        expect(this.shadowOfTheThrone.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
