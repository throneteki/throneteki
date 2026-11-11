describe('Shadow of the South', function () {
    function setup(plot) {
        this.setupTest({
            player1: {
                plot,
                inPlay: ['Robb Stark (Core)'],
                shadows: ['Shadow of the South']
            }
        });
        this.player1.clickCard(this.shadowOfTheSouth);
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Military');
    }

    it('makes a character lose a challenge icon of your choice until the end of the phase', function () {
        setup.call(this, 'Filler Plot');
        expect(this.robbStark.hasIcon('military')).toBe(false);
        expect(this.robbStark.hasIcon('power')).toBe(true);
        expect(this.shadowOfTheSouth.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns to your hand if there is a Scheme plot card revealed', function () {
        setup.call(this, 'Sneak Attack');
        expect(this.robbStark.hasIcon('military')).toBe(false);
        expect(this.shadowOfTheSouth.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
