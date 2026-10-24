describe('Shadow of the East', function () {
    function setup(plot) {
        this.setupTest({
            player1: {
                plot,
                inPlay: [{ card: 'Hedge Knight', attachments: ['Little Bird (Core)'] }],
                shadows: ['Shadow of the East']
            }
        });
        this.player1.clickCard(this.shadowOfTheEast);
    }

    it('discards an attachment from play', function () {
        setup.call(this, 'Filler Plot');
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.littleBird);
        expect(this.littleBird.location).toBe('discard pile');
        expect(this.shadowOfTheEast.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns to your hand if there is a Summer plot card revealed', function () {
        setup.call(this, 'Sailing the Summer Sea');
        this.player1.clickCard(this.littleBird);
        expect(this.littleBird.location).toBe('discard pile');
        expect(this.shadowOfTheEast.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
